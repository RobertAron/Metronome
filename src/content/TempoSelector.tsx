import { MetronomeSlider } from "./Slider";
import { useMetronomeContext } from "./MetronomeContext";

export function TempoSelector() {
  const {bpm, setBpm} = useMetronomeContext();
  const buttonStyle = "flex h-8 w-16 items-center justify-center rounded border border-black text-base focus-visible:border-amber-500 focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-amber-500 hover:bg-amber-500/10 dark:border-slate-700"

  return (
    <div className="flex flex-col gap-1">
      <MetronomeSlider />
      <div className="flex flex-row justify-between">
        <span className="flex flex-row">
          <button className={buttonStyle} onClick={e => setBpm(bpm-10)}> <p className="p-1">-10</p> </button>
          <button className={buttonStyle} onClick={e => setBpm(bpm-1)}> <p className="p-1">-1</p> </button>
        </span>
        <span className="flex flex-row">
          <button className={buttonStyle} onClick={e => setBpm(bpm+1)}> <p className="p-1">+1</p> </button>
          <button className={buttonStyle} onClick={e => setBpm(bpm+10)}> <p className="p-1">+10</p> </button>
        </span>
      </div>
    </div>
  );
}