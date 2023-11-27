import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying } = useMetronomeContext();
  return (
    <div className="bg-slate-500">
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Playing" : "Paused"}
      </button>
    </div>
  );
}
