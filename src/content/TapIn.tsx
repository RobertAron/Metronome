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
      className={
        "relative flex justify-center truncate rounded border border-black dark:border-slate-700 hocus:border-amber-500 dark:hocus:bg-slate-600 hocus:bg-amber-500/10 hocus:shadow-[0_0_0_2px] hocus:shadow-amber-500 hocus:outline-none"
      }
      onClick={updateTapInTimes}
    >
      <span className="p-1">TAP IN</span>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-amber-500 transition-all",
          {
            "w-[0%]": tapInTimes.length === 0,
            "w-[25%]": tapInTimes.length === 1,
            "w-[50%]": tapInTimes.length === 2,
            "w-[75%]": tapInTimes.length === 3,
            "w-[100%]": tapInTimes.length === 4,
          },
        )}
      />
    </button>
  );
}
