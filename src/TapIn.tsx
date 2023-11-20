import { useState } from "react";
import { Button, Text, View } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

export function TapIn() {
  const [tapInTimes, setTapInTimes] = useState<number[]>([]);
  const { playSound } = useMetronomeContext();
  function updateTapInTimes() {
    const now = Date.now();
    const newValues = tapInTimes.slice(-3);
    newValues.push(now);
    setTapInTimes(newValues);
    playSound();
  }
  return (
    <>
      <Button onPress={updateTapInTimes} title="tap in" />
      <View style={{ display: "flex" }}>
        {tapInTimes.map((ele,index) => (
          <Text key={index}>{((ele - tapInTimes[0]) / 1000).toFixed(2)}</Text>
        ))}
      </View>
    </>
  );
}
