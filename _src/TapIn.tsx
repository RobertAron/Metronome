import { useEffect, useState } from "react";
import { Button, View } from "react-native";
import { useMetronomeContext } from "./MetronomeContext";

const tapInCircleClasses =
  "aspect-square rounded-full w-3 flex-grow, border-2 border-black flex-shrink-0";
const tapInCircledEmptyClasses = "bg-transparent";
const tapInCircledFilledClasses = "bg-blue-800";

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
        <View className="bg-slate-400">
          <Button onPress={updateTapInTimes} title="tap in" />
        </View>
        <View style={{ display: "flex" }}>
          {/* {tapInTimes.map((ele, index) => (
            <Text key={index}>{((ele - tapInTimes[0]) / 1000).toFixed(2)}</Text>
          ))} */}
          <View className="flex flex-row justify-between">
            {new Array(4).fill(null).map((_, index) => (
              <View
                key={index}
                className={`${tapInCircleClasses} ${
                  tapInTimes[index]
                    ? tapInCircledFilledClasses
                    : tapInCircledEmptyClasses
                }`}
              />
            ))}
          </View>
        </View>
      </View>
    </>
  );
}
