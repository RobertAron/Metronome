import { Button } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying } = useMetronomeContext();
  return (
    <Button
      onPress={() => setIsPlaying(!isPlaying)}
      title={isPlaying ? "Playing" : "Paused"}
    />
  );
}
