import { Button, View } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying } = useMetronomeContext();
  return (
    <View className="bg-slate-500">
      <Button
        onPress={() => setIsPlaying(!isPlaying)}
        title={isPlaying ? "Playing" : "Paused"}
      />
    </View>
  );
}
