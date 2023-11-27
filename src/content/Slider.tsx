import { useMetronomeContext } from "./MetronomeContext";

export function MetronomeSlider() {
  const { bpm, setBpm } = useMetronomeContext();
  return (
    <div>
      <span className="text-4xl font-mono">
        {bpm.toFixed(2).padStart(6, "0")}
      </span>
      <input
        type="range"
        onChange={(e) => setBpm(Number(e.target.value))}
        value={bpm}
        className="w-10 h-10"
        min={40}
        max={200}
      />
    </div>
  );
}
