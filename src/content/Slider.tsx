import { useMetronomeContext } from "./MetronomeContext";

export function MetronomeSlider() {
  const { bpm, setBpm } = useMetronomeContext();
  // should have slider
  // text exit
  // tap in
  return (
    <div>
      <div className="flex items-baseline">
        <span className="text-6xl font-mono">
          {bpm.toFixed(2).padStart(6, "0")}
        </span>
        <span className="text-lg">BPM</span>
      </div>
      <input
        type="range"
        onChange={(e) => setBpm(Number(e.target.value))}
        value={bpm}
        className="w-full h-10"
        min={40}
        max={200}
      />
    </div>
  );
}
