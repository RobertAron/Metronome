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
const beatDefault: BeatType[][] = [
  ["primary"],
  ["secondary"],
  ["secondary"],
  ["secondary"],
];
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
});

// allow sound to overlap
function SuperAudio(src: string) {
  const context = new AudioContext();
  let audioBuffer: AudioBuffer | null = null;
  fetch(src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((bufffer) => (audioBuffer = bufffer));
  return {
    play() {
      const bufferSource = context.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(context.destination);
      bufferSource.start();
    },
  };
}

const sound1 = SuperAudio(met1);
const sound2 = SuperAudio(met2);

const myWorker = new Worker(workerUrlBlob);

type MetronomeContextProviderProps = {
  children: React.ReactNode;
};

function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

export function MetronomeContextProvider({
  children,
}: MetronomeContextProviderProps) {
  const [bpm, setBpm] = useState(100);
  const [lastPlayedSoundAt, setLastPlayedSoundAt] =
    useState<LastSoundInfo | null>(null);
  const [beats, setBeats] = useState(beatDefault);
  const [percentSpeed, setPercentSpeed] = useState(1);
  const isPlaying = lastPlayedSoundAt !== null;

  const playSound = useCallback(
    // played it should be included because this could be called at the wrong time if the event loop doesn't call it precisely
    (beatIndex: number, subBeatIndex: number, playedAt: number) => {
      const type = beats[beatIndex][subBeatIndex];
      if (type === "primary") sound1.play();
      else if (type === "secondary") sound2.play();
      setLastPlayedSoundAt({
        lastPlayedBeat: beatIndex,
        lastPlayedSubbeat: subBeatIndex,
        lastPlayedAt: playedAt,
      });
    },
    [beats]
  );

  useEffect(() => {
    const soundCallback = (m: MessageEvent<[number, number, number]>) =>
      playSound(...m.data);
    myWorker.addEventListener("message", soundCallback);
    return () => myWorker.removeEventListener("message", soundCallback);
  }, [playSound]);

  useEffect(() => {
    const beatsMax = beats.length;
    const subdivisionMax = beats[0].length;
    // after something gets played, setup for the next sound.
    if (isPlaying) {
      const soundsPerMinute = bpm * percentSpeed * subdivisionMax;
      const msPerSound = (1 / soundsPerMinute) * 60 * 1000;
      const nextSoundAt = msPerSound + lastPlayedSoundAt.lastPlayedAt;
      const timeUntilNextSound = Math.max(nextSoundAt - Date.now(), 0);

      let nextBeat = lastPlayedSoundAt.lastPlayedBeat;
      let nextSubbeat = lastPlayedSoundAt.lastPlayedSubbeat + 1;
      if (nextSubbeat >= subdivisionMax) {
        nextBeat += 1;
        nextSubbeat = 0;
      }
      if (nextBeat >= beatsMax) {
        nextBeat = 0;
      }
      myWorker.postMessage({
        time: timeUntilNextSound,
        params: [nextBeat, nextSubbeat, Date.now() + timeUntilNextSound],
      });
      return () => myWorker.postMessage({});
    }
  }, [bpm, isPlaying, lastPlayedSoundAt, beats, percentSpeed]);

  const setIsPlayingWrapper = useCallback((isPlaying: boolean) => {
    if (isPlaying) setLastPlayedSoundAt(lastSoundInit);
    setLastPlayedSoundAt(isPlaying ? lastSoundInit : null);
  }, []);
  const setBpmWrapper = useCallback((bpm: number) => {
    setBpm(clamp(1, 300, bpm));
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
