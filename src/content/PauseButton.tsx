import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import * as Toggle from "@radix-ui/react-toggle";
import { cn } from "../other/cn";
import { useMetronomeContext } from "./MetronomeContext";

export function PauseButton() {
  const { setIsPlaying, isPlaying } = useMetronomeContext();
  const CurrentIcon = isPlaying ? PauseIcon : PlayIcon;
  return (
    <Toggle.Root
      aria-label="Toggle Playing"
      className="flex h-8 w-full items-center justify-center rounded border border-black bg-white text-base hocus:bg-amber-50 focus:outline-none focus-visible:border-amber-500 focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-amber-500"
      pressed={isPlaying}
      onPressedChange={() => setIsPlaying(!isPlaying)}
    >
      <div className="grid grid-cols-[min-content_1fr] items-center gap-2">
        <div className="col-start-1 col-end-1 h-5 w-5">
          <CurrentIcon className="h-full w-full" />
        </div>
        <span
          className={cn("col-start-2 col-end-2 row-start-1 text-left text-lg", {
            invisible: isPlaying,
          })}
        >
          Play
        </span>
        <span
          className={cn("col-start-2 col-end-2 row-start-1 text-left text-lg", {
            invisible: !isPlaying,
          })}
        >
          Pause
        </span>
      </div>
    </Toggle.Root>
  );
}
