import { cn } from "../other/cn";
import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying, lastPlayedSoundAt } = useMetronomeContext();
  return (
    <div className="flex">
      <button
        className="bg-[#b5d5de] text-black border border-[#2b373e] rounded p-2"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? "Playing" : "Paused"}
      </button>
      <div className="border border-[#2b373e] flex p-1">
        {new Array(4).fill(null).map((ele, index) => (
          <div
            key={index}
            className={cn("w-2 h-2 rounded-full", {
              "bg-blue-950": index < lastPlayedSoundAt.lastIndexPlayed + 1,
            })}
          />
        ))}
      </div>
    </div>
  );
}
