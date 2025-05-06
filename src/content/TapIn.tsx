import { useEffect, useState } from "react";
import { useMetronomeContext } from "./MetronomeContext";
import { cn } from "../other/cn";

type TapInState = null | {
  firstTapTimestamp: number;
  mostRecentTapTimestamp: number;
  numberOfTaps: number;
};

export function TapIn() {
  const { setBpm } = useMetronomeContext();
  const [tapInState, setTapInState] = useState<TapInState>(null);
  function updateTapInTimes() {
    const now = Date.now();
    const newFirstTapTimestamp = tapInState?.firstTapTimestamp ?? now;
    const newMostRecentTapTimestamp = now;
    const newNumberOfTaps = (tapInState?.numberOfTaps ?? 0) + 1;

    const msPassed = newMostRecentTapTimestamp - newFirstTapTimestamp;
    const beatsPerMillisecond = (newNumberOfTaps - 1) / msPassed;
    const beatsPerMinute = beatsPerMillisecond * 60_000;
    if (newNumberOfTaps >= 4) setBpm(beatsPerMinute);
    setTapInState({
      firstTapTimestamp: newFirstTapTimestamp,
      mostRecentTapTimestamp: newMostRecentTapTimestamp,
      numberOfTaps: newNumberOfTaps,
    });
  }
  useEffect(() => {
    if (tapInState === null) return;
    const interval = setInterval(() => {
      setTapInState(null);
    }, 3_000);
    return () => clearInterval(interval);
  }, [tapInState]);
  return (
    <button
      type="button"
      className="relative flex justify-center truncate rounded border border-black hocus:border-amber-500 hocus:bg-amber-500/10 hocus:shadow-[0_0_0_2px] hocus:shadow-amber-500 hocus:outline-none dark:border-slate-700 dark:hocus:bg-slate-600"
      onClick={updateTapInTimes}
    >
      <span className="p-1">TAP IN</span>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-amber-500 transition-all",
          {
            "w-[0%]": tapInState?.numberOfTaps === 0,
            "w-[25%]": tapInState?.numberOfTaps === 1,
            "w-[50%]": tapInState?.numberOfTaps === 2,
            "w-[75%]": tapInState?.numberOfTaps === 3,
            "w-[100%]": (tapInState?.numberOfTaps ?? 0) >= 4,
          },
        )}
      />
    </button>
  );
}
