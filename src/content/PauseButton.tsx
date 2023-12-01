import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying } = useMetronomeContext();
  return (
    <div className="bg-[#b5d5de] text-black border border-[#2b373e] rounded p-2">
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Playing" : "Paused"}
      </button>
    </div>
  );
}
