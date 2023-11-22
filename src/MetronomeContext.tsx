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
});

const soundPromise = Audio.Sound.createAsync(require("../assets/metsound.mp3"));
const soundPromise2 = Audio.Sound.createAsync(
  require("../assets/metsound2.mp3")
);

function useSound() {
  const { data } = useSWR(["metsound"], () =>
    Promise.all([soundPromise, soundPromise2])
  );
  const [sound1, sound2] = data ?? [];
  const result: [Audio.Sound, Audio.Sound] | undefined =
    sound1?.status.isLoaded && sound2?.status.isLoaded
      ? [sound1.sound, sound2.sound]
      : undefined;
  return result;
}

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
  const [sound1, sound2] = useSound() ?? [];
  const [lastPlayedSoundAt, setLastPlayedSoundAt] = useState<LastSoundInfo>({
    lastIndexPlayed: -1,
    lastPlayedAt: 0,
  });
  const [beats, setBeats] = useState<BeatTypes[]>([
    "primary",
    "secondary",
    "secondary",
    "secondary",
  ]);

  function playSound(soundIndex: number) {
    const type = beats[soundIndex];
    if (type === "primary") sound1?.replayAsync();
    else if (type === "secondary") sound2?.replayAsync();
    setLastPlayedSoundAt({
      lastIndexPlayed: soundIndex,
      lastPlayedAt: Date.now(),
    });
  }
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
  }, [bpm, isPlaying, lastPlayedSoundAt]);
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
