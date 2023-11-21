import { Audio } from "expo-av";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
} from "react";
import useSWR from "swr";

const setIsPlayingDefault: Dispatch<React.SetStateAction<boolean>> = () => {};
const setIsBpmDefault: Dispatch<React.SetStateAction<number>> = () => {};
const MetronomeContext = createContext({
  bpm: 100,
  setBpm: setIsBpmDefault,
  isPlaying: false,
  setIsPlaying: setIsPlayingDefault,
  playSound: () => {},
});

const soundPromise = Audio.Sound.createAsync(require("../assets/metsound.mp3"));

function useSound() {
  const { data } = useSWR(["metsound"], () => soundPromise);
  return data?.status.isLoaded ? data?.sound : undefined;
}

type MetronomeContextProviderProps = {
  children: React.ReactNode;
};
export function MetronomeContextProvider({
  children,
}: MetronomeContextProviderProps) {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useSound();
  const [lastPlayedSoundAt, setLastPlayedSoundAt] = useState(0);
  function playSound() {
    sound?.replayAsync();
    setLastPlayedSoundAt(Date.now());
  }
  useEffect(() => {
    // after something gets played, setup for the next sound.
    if (isPlaying) {
      const msPerBeat = (1 / bpm) * 60 * 1000;
      const nextSoundAt = msPerBeat + lastPlayedSoundAt;
      const timeUntilNextSound = Math.max(nextSoundAt - Date.now(), 0);
      const timeout = setTimeout(() => {
        playSound();
      }, timeUntilNextSound);
      return () => clearTimeout(timeout);
    }
  }, [sound, bpm, isPlaying, lastPlayedSoundAt]);
  return (
    <MetronomeContext.Provider
      value={{
        bpm,
        setBpm,
        isPlaying,
        playSound,
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
