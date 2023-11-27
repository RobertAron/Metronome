import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

export function MetronomeSlider() {
  const { bpm, setBpm } = useMetronomeContext();
  return (
    <View>
      <Text className="text-4xl font-mono">
        {bpm.toFixed(2).padStart(6, "0")}
      </Text>
      <Slider
        onValueChange={(value) => setBpm(value)}
        value={bpm}
        className="w-10 h-10"
        minimumValue={40}
        maximumValue={200}
        minimumTrackTintColor="#FF0000"
        maximumTrackTintColor="#000000"
      />
    </View>
  );
}
