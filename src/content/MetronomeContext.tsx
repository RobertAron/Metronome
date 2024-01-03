import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import met1 from "./assets/metsound.mp3";
import met2 from "./assets/metsound2.mp3";
import { workerUrlBlob } from "./MetronomeWorker";
import { MotionValue, animate, useMotionValue } from "framer-motion";
import { rhythmOptions } from "../other/rhythmOptions";

type LastSoundInfo = {
  lastPlayedBeat: number;
  lastPlayedSubbeat: number;
  lastPlayedAt: number;
};

const lastSoundInit: LastSoundInfo = {
  lastPlayedBeat: 0,
  lastPlayedSubbeat: -1,
  lastPlayedAt: 0,
};
const lastSoundDefault = null as LastSoundInfo | null;

export type BeatType = "primary" | "secondary" | "rest";
const beatDefault: BeatType[][] = rhythmOptions[0].metronomeBeats;
const setBeatsDefault: (beats: BeatType[][]) => void = () => {};

const setIsPlayingDefault: (isPlaying: boolean) => void = () => {};
const setIsBpmDefault: (bpm: number) => void = () => {};
const setPercentSpeedDefault: (bpm: number) => void = () => {};

const MetronomeContext = createContext({
  bpm: 100,
  setBpm: setIsBpmDefault,
  isPlaying: false,
  setIsPlaying: setIsPlayingDefault,
  lastPlayedSoundAt: lastSoundDefault,
  beats: beatDefault,
  setBeats: setBeatsDefault,
  percentSpeed: 1,
  setPercentSpeed: setPercentSpeedDefault,
  motionRef: null! as MotionValue<number>,
});
export const audioContext = new AudioContext();
const lowerGainTarget = audioContext.createGain();
lowerGainTarget.gain.value = 0.5;
lowerGainTarget.connect(audioContext.destination);

// allow sound to overlap
function SuperAudio(src: string) {
  let audioBuffer: AudioBuffer | null = null;
  fetch(src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((bufffer) => (audioBuffer = bufffer));
  return {
    play(delay: number, emphasize: boolean) {
      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      const target = emphasize ? audioContext.destination : lowerGainTarget;
      bufferSource.connect(target);
      bufferSource.start(audioContext.currentTime + delay / 1000);
    },
  };
}

const sound1 = SuperAudio(met1);
const sound2 = SuperAudio(met2);

const soundCommitWorker = new Worker(workerUrlBlob);
const soundPlayWorker = new Worker(workerUrlBlob);

type MetronomeContextProviderProps = {
  children: React.ReactNode;
};

function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

const commitToPlayDelay = 100;

export function MetronomeContextProvider({
  children,
}: MetronomeContextProviderProps) {
  const motionRef = useMotionValue(0);
  const [bpm, setBpm] = useState(100);
  const [lastPlayedSoundAt, setLastPlayedSoundAt] =
    useState<LastSoundInfo | null>(null);
  const [beats, setBeats] = useState(beatDefault);
  const [percentSpeed, setPercentSpeed] = useState(1);
  const isPlaying = lastPlayedSoundAt !== null;

  const commitToSound = useCallback(
    // played it should be included because this could be called at the wrong time if the event loop doesn't call it precisely
    (beatIndex: number, subBeatIndex: number, playedAt: number) => {
      const type = beats[beatIndex][subBeatIndex];
      // sound is scheduled to be played late because the event loop isn't perfect.
      const timeUntilPlay = playedAt + commitToPlayDelay - Date.now();
      const timeUntilPlayProtected = Math.max(timeUntilPlay, 0);
      const emphasize = subBeatIndex === 0;
      if (type === "primary") sound1.play(timeUntilPlayProtected, emphasize);
      else if (type === "secondary")
        sound2.play(timeUntilPlayProtected, emphasize);
      // when the beat is confirmed to have played - setup the state to reflext it has played
      setLastPlayedSoundAt({
        lastPlayedBeat: beatIndex,
        lastPlayedSubbeat: subBeatIndex,
        lastPlayedAt: playedAt,
      });
      // if it's a down beat, trigger metronome animation
      if (subBeatIndex === 0)
        soundPlayWorker.postMessage({
          time: timeUntilPlay,
          params: [],
        });
    },
    [beats],
  );

  // Connect commit sound events to react state
  useEffect(() => {
    const soundCallback = (m: MessageEvent<[number, number, number]>) =>
      commitToSound(...m.data);
    soundCommitWorker.addEventListener("message", soundCallback);
    return () =>
      soundCommitWorker.removeEventListener("message", soundCallback);
  }, [commitToSound]);

  // Connect sound events to animation state
  useEffect(() => {
    const soundCallback = () => {
      const beatsPerMinute = bpm * percentSpeed;
      const msPerBeat = (1 / beatsPerMinute) * 60 * 1000;
      const currentPercentage = motionRef.get();
      const currentSide = currentPercentage > 90 ? "right" : "left";
      motionRef.set(currentSide === "right" ? 180 : 0);
      animate(motionRef, currentSide === "right" ? 0 : 180, {
        duration: msPerBeat / 1000,
        ease: "linear",
      });
    };
    soundPlayWorker.addEventListener("message", soundCallback);
    return () => soundPlayWorker.removeEventListener("message", soundCallback);
  }, [bpm, percentSpeed, motionRef]);

  // on state update send message to the sound commit worker
  // after something gets played, setup for the next sound.
  useEffect(() => {
    if (isPlaying) {
      const subdivisionMax = beats[0].length;
      const soundsPerMinute = bpm * percentSpeed * subdivisionMax;
      const msPerSound = (1 / soundsPerMinute) * 60 * 1000;
      const nextSoundAt = msPerSound + lastPlayedSoundAt.lastPlayedAt;
      const timeUntilComitSound = Math.max(nextSoundAt - Date.now(), 0);

      const beatsMax = beats.length;
      let nextBeat = lastPlayedSoundAt.lastPlayedBeat;
      let nextSubbeat = lastPlayedSoundAt.lastPlayedSubbeat + 1;
      if (nextSubbeat >= subdivisionMax) {
        nextBeat += 1;
        nextSubbeat = 0;
      }
      if (nextBeat >= beatsMax) {
        nextBeat = 0;
      }
      soundCommitWorker.postMessage({
        time: timeUntilComitSound,
        params: [nextBeat, nextSubbeat, Date.now() + timeUntilComitSound],
      });
      return () => {
        return soundCommitWorker.postMessage({});
      };
    }
  }, [bpm, isPlaying, lastPlayedSoundAt, beats, percentSpeed, motionRef]);

  // "is playing" really means there is some previous sound in the state
  const setIsPlayingWrapper = useCallback((isPlaying: boolean) => {
    if (isPlaying) setLastPlayedSoundAt(lastSoundInit);
    setLastPlayedSoundAt(isPlaying ? lastSoundInit : null);
  }, []);
  // BPM setter. Restrict bpm range.
  const setBpmWrapper = useCallback((bpm: number) => {
    setBpm(clamp(40, 300, bpm));
  }, []);
  return (
    <MetronomeContext.Provider
      value={{
        bpm,
        setBpm: setBpmWrapper,
        isPlaying,
        setIsPlaying: setIsPlayingWrapper,
        lastPlayedSoundAt,
        beats,
        setBeats,
        percentSpeed,
        setPercentSpeed,
        motionRef,
      }}
    >
      <IosAudioHack />
      {children}
    </MetronomeContext.Provider>
  );
}

function useMetronomeContext() {
  return useContext(MetronomeContext);
}

//======================================================
// Absolute BS incoming
// https://github.com/swevans/unmute/blob/master/dev/src/unmute.ts#L191
//======================================================
/**
 * A very short bit of silence to be played with <audio>, which forces AudioContext onto the audio channel.
 * NOTE: The silence MP3 must be high quality, when web audio sounds are played in parallel the web audio sound is mixed to match the bitrate of the html sound.
 * This file is 0.01 seconds of silence VBR220-260 Joint Stereo 859B
 * The str below is a "compressed" version using poor mans huffman encoding, saves about 0.5kb
 */
const silence =
  "data:audio/mpeg;base64,//uQx" +
  "A".repeat(23) +
  "WGluZwAAAA8AAAACAAACcQCA" +
  "gICA".repeat(16) +
  "/".repeat(66) +
  "8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkI" +
  "A".repeat(320) +
  "//sQxAADgnABGiAAQBCqgCRMAAgEAH" +
  "/".repeat(15) +
  "7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq" +
  "/".repeat(18) +
  "9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAw" +
  "V".repeat(97) +
  "Q==";

// Hack for iphones that have the ringer muted.
// Running this empty audio forces all sounds to the media channel
function IosAudioHack() {
  const { isPlaying, setIsPlaying } = useMetronomeContext();
  const ref = useRef<HTMLAudioElement>(null);
  // this is needed because there's no way to hide the media alerts so unless there is no media playing.
  useEffect(() => {
    const onVisChange = () => {
      if (document.visibilityState === "hidden") setIsPlaying(false);
    };
    if (window.navigator.userAgent.includes("iPhone")) {
      document.addEventListener("visibilitychange", onVisChange);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [isPlaying, setIsPlaying]);
  useEffect(() => {
    if (ref.current === null) return;
    if (isPlaying) ref.current.play();
    else ref.current.pause();
  }, [isPlaying]);
  return (
    <audio
      ref={ref}
      className="hidden"
      x-webkit-airplay="deny"
      src={isPlaying ? silence : "."}
      preload="auto"
      loop
    />
  );
}

export { MetronomeContextProvider as MetronomeContext, useMetronomeContext };
