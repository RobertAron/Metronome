import { useMetronomeContext } from "./MetronomeContext";

export function Bpm() {
  const { bpm, percentSpeed } = useMetronomeContext();
  return (
    <div>
      <div className="flex items-baseline">
      <span className="text-6xl font-mono">
        {bpm.toFixed(2).padStart(6, "0")}
      </span>
        <span className="text-lg">BPM</span>
      </div>

      {
        percentSpeed !== 1 ? (
          <div className="flex items-baseline text-gray-500 space-x-1">
            <span className="text-xl font-mono">
              {(bpm * percentSpeed).toFixed(2).padStart(6, "0")}
            </span>
            <span className="text-lg">BPM</span>
          </div>
        ) : null
      }
    </div>
  );
}
