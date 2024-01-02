import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
const context = new AudioContext();
const lowerGainTarget = context.createGain();
lowerGainTarget.gain.value = 0.5;
lowerGainTarget.connect(context.destination);

// allow sound to overlap
function SuperAudio(src: string) {
  let audioBuffer: AudioBuffer | null = null;
  fetch(src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((bufffer) => (audioBuffer = bufffer));
  return {
    play(delay: number, emphasize: boolean) {
      const bufferSource = context.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(emphasize ? context.destination : lowerGainTarget);
      bufferSource.context.createGain();
      bufferSource.start(context.currentTime + delay / 1000);
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
      {children}
    </MetronomeContext.Provider>
  );
}

function useMetronomeContext() {
  return useContext(MetronomeContext);
}

export { MetronomeContextProvider as MetronomeContext, useMetronomeContext };
