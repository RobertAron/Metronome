import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Audio } from "expo-av";
import useSWR from "swr";
import { TapIn } from "./src/TapIn";
import { MetronomeContext } from "./src/MetronomeContext";
import { MetronomeSlider } from "./src/Slider";
import { PauseButton } from "./src/PauseButton";
const soundPromise = Audio.Sound.createAsync(require("./assets/metsound.mp3"));

function useSound() {
  const { data } = useSWR(["metsound"], () => soundPromise);
  return data?.status.isLoaded ? data?.sound : undefined;
}

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
