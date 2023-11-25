import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { TapIn } from "./src/TapIn";
import { MetronomeContext } from "./src/MetronomeContext";
import { MetronomeSlider } from "./src/Slider";
import { PauseButton } from "./src/PauseButton";
import { NativeWindStyleSheet } from "nativewind";
import "./styles.css";


NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <MetronomeContext>
      <View style={styles.container}>
        <MetronomeSlider />
        <PauseButton />
        <TapIn />
        <StatusBar style="auto" />
      </View>
    </MetronomeContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
