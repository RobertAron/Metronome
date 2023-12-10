import { cn } from "../other/cn";
import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying } = useMetronomeContext();
  return (
    <div className="flex">
      <button
        className={cn(
          "bg-cyan-400 text-black border border-[#2b373e] rounded p-2 w-full",
          {
            "bg-green-300": isPlaying,
          }
        )}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? "Playing" : "Paused"}
      </button>
    </div>
  );
}
