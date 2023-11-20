import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

export function MetronomeSlider() {
  const { bpm, setBpm } = useMetronomeContext();
  return (
    <View>
      <Text style={{ fontSize: 100, fontFamily: "mono" }}>
        {bpm.toFixed(2).padStart(6, "0")}
      </Text>
      <Slider
        onValueChange={(value) => setBpm(value)}
        value={bpm}
        style={{ width: 200, height: 40 }}
        minimumValue={40}
        maximumValue={200}
        minimumTrackTintColor="#FF0000"
        maximumTrackTintColor="#000000"
      />
    </View>
  );
}
