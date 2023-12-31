import { cn } from "../other/cn";
import { useMetronomeContext } from "./MetronomeContext";
import * as Slider from "@radix-ui/react-slider";

export function MetronomeSlider({
  direction = "horizontal",
}: {
  direction?: "vertical" | "horizontal";
}) {
  const { bpm, setBpm } = useMetronomeContext();
  return (
    <Slider.Root
      className={cn(
        "group relative flex w-full touch-none select-none items-center",
        direction === "vertical" ? "h-full w-5" : "h-5 w-full",
      )}
      defaultValue={[100]}
      max={300}
      min={40}
      step={1}
      value={[bpm]}
      onValueChange={([newVal]) => setBpm(newVal)}
      orientation={direction}
    >
      <Slider.Track className="relative h-[3px] grow rounded-full bg-zinc-400 transition-colors group-focus-within:bg-zinc-500 group-hover:bg-zinc-500">
        <Slider.Range className="absolute h-full rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-950" />
      </Slider.Track>
      <Slider.Thumb
        className="block h-5 w-5 rounded-full border-4 border-zinc-700 bg-white transition-all focus:outline-none group-focus-within:border-[5px] group-focus-within:border-amber-500 group-hover:border-[5px] group-hover:border-amber-500 "
        aria-label="Beats Per Minute"
      />
    </Slider.Root>
  );
}
