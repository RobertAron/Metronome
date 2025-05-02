import { useEffect, useState } from "react";
import { useMetronomeContext } from "./MetronomeContext";
import { cn } from "../other/cn";

// I'm copying TapTempo.io's algorithm, which converges to an average tempo
//  See: https://taptempo.io/taptempo.js

let groundZero = 0,
  lastTap = 0,
  counter = 0,
  tapDiff = 0,
  avgBpm = 0,
  previousTap = 0,
  elapsed = 0;

// We do this to keep previous tempo readings from counting for the average of the next reading
function resetTapper() {
  groundZero = 0;
  lastTap = 0;
  counter = 0;
  tapDiff = 0;
  avgBpm = 0;
  previousTap = 0;
  elapsed = 0;
}

function tap() {
  if (lastTap === 0) {
    groundZero = new Date().getTime();
    counter = 0;
  }

  lastTap = new Date().getTime();
  elapsed = new Date().getTime() - previousTap;

  previousTap = lastTap;
  tapDiff = lastTap - groundZero;
  if (tapDiff !== 0) {
    avgBpm = Math.round((60_000 * counter) / tapDiff);
  }
  counter++;

  if (elapsed > 3_000) lastTap = 0;
  return avgBpm;
}

export function TapIn() {
  const { setBpm } = useMetronomeContext();

  // Only used for the orange bar
  const [ taps, setTaps ] = useState(0);

  useEffect(() => {
    if (taps === 0) return;
    const interval = setInterval(() => {
      setTaps(0);
      resetTapper();
    }, 3_000);
    return () => clearInterval(interval);
  }, [counter]); // I'm not sure if this is valid in React (this not being a useState)

  return (
    <button
      className={
        "relative flex justify-center truncate rounded border border-black dark:border-slate-700 hocus:border-amber-500 dark:hocus:bg-slate-600 hocus:bg-amber-500/10 hocus:shadow-[0_0_0_2px] hocus:shadow-amber-500 hocus:outline-none"
      }
      onClick={() => {
        setTaps(taps+1);
        setBpm(tap());
      }}
    >
      <span className="p-1">TAP IN</span>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-amber-500 transition-all",
          {
            "w-[0%]": taps === 0,
            "w-[25%]": taps === 1,
            "w-[50%]": taps === 2,
            "w-[75%]": taps === 3,
            "w-[100%]": taps >= 4,
          }
        )}
      />
    </button>
  );
}
