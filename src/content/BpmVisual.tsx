import { useMetronomeContext } from "./MetronomeContext";

export function Bpm() {
  const { bpm, percentSpeed } = useMetronomeContext();
  return (
    <div>
      <div className="flex items-baseline">
        <span className="font-mono text-6xl">
          {bpm.toFixed(2).padStart(6, "0")}
        </span>
        <span className="text-lg">BPM</span>
      </div>
      {percentSpeed !== 1 && (
        <div className="flex items-baseline space-x-1 font-mono text-lg text-gray-500">
          <span>{(bpm * percentSpeed).toFixed(2).padStart(6, "0")}</span>
          <span>BPM</span>
        </div>
      )}
    </div>
  );
}
