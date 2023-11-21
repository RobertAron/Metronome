import { useEffect, useState } from "react";
import { Button, StyleProp, Text, View, ViewStyle } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

const tapInCircleStyle = {
  aspectRatio: "1",

  borderRadius: 999,
  width: 10,
  flexGrow: 1,
  borderColor: "black",
  borderWidth: 2,
};
const tapInCircleFilled = {
  backgroundColor: "blue",
};
const tapInCircleEmpty = {
  backgroundColor: "transparent",
};

export function TapIn() {
  const { setBpm } = useMetronomeContext();
  const [tapInTimes, setTapInTimes] = useState<number[]>([]);
  function updateTapInTimes() {
    const now = Date.now();
    const newValues = tapInTimes.slice(-3);
    newValues.push(now);
    setTapInTimes(newValues);
    if (newValues.length === 4) {
      const sum = newValues[3] - newValues[0];
      // 4 beats in `sum` seconds ms
      const beatsPerMillisecond = 4 / sum;
      const beatsPerMinute = beatsPerMillisecond * 1000 * 60;
      setBpm(beatsPerMinute);
    }
  }
  useEffect(() => {
    if (tapInTimes.length === 0) return;
    const interval = setInterval(() => {
      setTapInTimes([]);
    }, 3_000);
    return () => clearInterval(interval);
  }, [tapInTimes]);
  return (
    <>
      <View>
        <Button onPress={updateTapInTimes} title="tap in" />
        <View style={{ display: "flex" }}>
          {/* {tapInTimes.map((ele, index) => (
            <Text key={index}>{((ele - tapInTimes[0]) / 1000).toFixed(2)}</Text>
          ))} */}
          <View
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                ...tapInCircleStyle,
                ...(tapInTimes[0] === undefined
                  ? tapInCircleEmpty
                  : tapInCircleFilled),
              }}
            />
            <View
              style={{
                ...tapInCircleStyle,
                ...(tapInTimes[1] === undefined
                  ? tapInCircleEmpty
                  : tapInCircleFilled),
              }}
            />
            <View
              style={{
                ...tapInCircleStyle,
                ...(tapInTimes[2] === undefined
                  ? tapInCircleEmpty
                  : tapInCircleFilled),
              }}
            />
            <View
              style={{
                ...tapInCircleStyle,
                ...(tapInTimes[3] === undefined
                  ? tapInCircleEmpty
                  : tapInCircleFilled),
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}
