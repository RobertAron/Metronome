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

const setIsPlayingDefault: Dispatch<React.SetStateAction<boolean>> = () => {};
const setIsBpmDefault: Dispatch<React.SetStateAction<number>> = () => {};
const MetronomeContext = createContext({
  bpm: 100,
  setBpm: setIsBpmDefault,
  isPlaying: false,
  setIsPlaying: setIsPlayingDefault,
});

const sound1 = new Audio(met1);
const sound2 = new Audio(met2);

type BeatTypes = "primary" | "secondary" | "rest";
type MetronomeContextProviderProps = {
  children: React.ReactNode;
};

type LastSoundInfo = {
  lastIndexPlayed: number;
  lastPlayedAt: number;
};

export function MetronomeContextProvider({
  children,
}: MetronomeContextProviderProps) {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastPlayedSoundAt, setLastPlayedSoundAt] = useState<LastSoundInfo>({
    lastIndexPlayed: -1,
    lastPlayedAt: 0,
  });
  const [beats, _setBeats] = useState<BeatTypes[]>([
    "primary",
    "secondary",
    "secondary",
    "secondary",
  ]);

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
      const msPerBeat = (1 / bpm) * 60 * 1000;
      const nextSoundAt = msPerBeat + lastPlayedSoundAt.lastPlayedAt;
      const timeUntilNextSound = Math.max(nextSoundAt - Date.now(), 0);
      const nextIndex = (lastPlayedSoundAt.lastIndexPlayed + 1) % beats.length;
      const timeout = setTimeout(() => {
        playSound(nextIndex);
      }, timeUntilNextSound);
      return () => clearTimeout(timeout);
    }
  }, [bpm, isPlaying, lastPlayedSoundAt, beats, playSound]);
  return (
    <MetronomeContext.Provider
      value={{
        bpm,
        setBpm,
        isPlaying,
        setIsPlaying,
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
