import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  useCallback,
} from "react";
import met1 from "./metsound.mp3";
import met2 from "./metsound2.mp3";

type LastSoundInfo = {
  lastIndexPlayed: number;
  lastPlayedAt: number;
};

const lastSoundDefault: LastSoundInfo = {
  lastIndexPlayed: -1,
  lastPlayedAt: 0,
};

export type BeatType = "primary" | "secondary" | "rest";
const beatDefault: BeatType[] = [
  "primary",
  "secondary",
  "secondary",
  "secondary",
];
const setBeatsDefault: (beats: BeatType[]) => void = () => {};

const setIsPlayingDefault: Dispatch<React.SetStateAction<boolean>> = () => {};
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastPlayedSoundAt, setLastPlayedSoundAt] =
    useState<LastSoundInfo>(lastSoundDefault);
  const [beats, setBeats] = useState(beatDefault);
  const [percentSpeed, setPercentSpeed] = useState(1);

  const playSound = useCallback(
    (soundIndex: number) => {
      const type = beats[soundIndex];
      if (type === "primary") sound1.play();
      else if (type === "secondary") sound2.play();
      setLastPlayedSoundAt({
        lastIndexPlayed: soundIndex,
        lastPlayedAt: Date.now(),
      });
    },
    [beats]
  );
  useEffect(() => {
    // after something gets played, setup for the next sound.
    if (isPlaying) {
      const msPerBeat = (1 / (bpm * percentSpeed)) * 60 * 1000;
      const nextSoundAt = msPerBeat + lastPlayedSoundAt.lastPlayedAt;
      const timeUntilNextSound = Math.max(nextSoundAt - Date.now(), 0);
      const nextIndex = (lastPlayedSoundAt.lastIndexPlayed + 1) % beats.length;
      // switch to request animation frame to fix the tabout issue
      const timeout = setTimeout(() => {
        playSound(nextIndex);
      }, timeUntilNextSound);
      return () => clearTimeout(timeout);
    }
  }, [bpm, isPlaying, lastPlayedSoundAt, beats, playSound, percentSpeed]);
  type dispatchParameter = Parameters<
    Dispatch<React.SetStateAction<boolean>>
  >[0];
  const setIsPlayingWrapper = useCallback(
    (isPlayingDispatch: dispatchParameter) => {
      if (typeof isPlayingDispatch === "function")
        setIsPlaying(isPlayingDispatch);
      else setIsPlaying(isPlayingDispatch);
      setLastPlayedSoundAt(lastSoundDefault);
    },
    []
  );
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
