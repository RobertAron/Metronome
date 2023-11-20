import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Slider from "@react-native-community/slider";
const soundPromise = Audio.Sound.createAsync(require("./assets/metsound.mp3"));

function useSound() {
  const { data } = useSWR(["metsound"], () => soundPromise);
  return data?.status.isLoaded ? data?.sound : undefined;
}

export default function App() {
  const sound = useSound();
  const [bpm, setBmp] = useState(100);
  const lastPlayedSoundAt = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    function loop() {
      const msPerBeat = (1 / bpm) * 60 * 1000;
      const nextSoundAt = msPerBeat + lastPlayedSoundAt.current;
      const timeUntilNextSound = Math.max(nextSoundAt - Date.now(), 0);
      timeout = setTimeout(() => {
        // Your logic here
        sound?.replayAsync();
        lastPlayedSoundAt.current = Date.now();
        loop();
      }, timeUntilNextSound);
    }
    if (isPlaying) loop();
    return () => clearTimeout(timeout);
  }, [sound, bpm, isPlaying]);
  return (
    <View style={styles.container}>
      <View style={{ display: "flex" }}>
        <Text style={{ fontSize: 100, fontFamily: "mono" }}>
          {bpm.toFixed(2).padStart(6, "0")}
        </Text>
        <Slider
          onValueChange={(value) => setBmp(value)}
          value={bpm}
          style={{ width: 200, height: 40 }}
          minimumValue={40}
          maximumValue={200}
          minimumTrackTintColor="#FF0000"
          maximumTrackTintColor="#000000"
        />
      </View>
      <Button
        onPress={() => setIsPlaying(!isPlaying)}
        title={isPlaying ? "Playing" : "Paused"}
      />
      <StatusBar style="auto" />
    </View>
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
