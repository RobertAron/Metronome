import { useMetronomeContext } from "./MetronomeContext";

export function Bpm() {
  const { bpm } = useMetronomeContext();
  return (
    <div className="flex items-baseline">
      <span className="text-6xl font-mono">
        {bpm.toFixed(2).padStart(6, "0")}
      </span>
      <span className="text-lg">BPM</span>
    </div>
  );
}
