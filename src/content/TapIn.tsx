import { useEffect, useState } from "react";
import { useMetronomeContext } from "./MetronomeContext";
import { cn } from "../other/cn";

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
      // since the beggining time, there have been 3 beats
      const beatsPerMillisecond = 3 / sum;
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
    <button
      className={cn("bg-cyan-400 text-black border-4 border-cyan-400 p-2 truncate", {
        "bg-green-300": tapInTimes.length === 4,
        "border-t-green-300": tapInTimes.length >= 1,
        "border-r-green-300": tapInTimes.length >= 2,
        "border-b-green-300": tapInTimes.length >= 3,
        "border-l-green-300": tapInTimes.length >= 4,
      })}
      onClick={updateTapInTimes}
    >
      TAP IN
    </button>
  );
}
