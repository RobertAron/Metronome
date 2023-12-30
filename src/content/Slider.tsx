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
        "relative flex items-center select-none touch-none w-full group",
        direction === "vertical" ? "w-5 h-full" : "h-5 w-full"
      )}
      defaultValue={[100]}
      max={300}
      min={40}
      step={1}
      value={[bpm]}
      onValueChange={([newVal]) => setBpm(newVal)}
      orientation={direction}
    >
      <Slider.Track className="bg-zinc-400 group-hover:bg-zinc-500 group-focus-within:bg-zinc-500 transition-colors relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-zinc-800 group-hover:bg-zinc-950 transition-colors rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-5 h-5 bg-white border-4 border-zinc-700 hocus:border-[5px] transition-all hocus:border-amber-500 rounded-full focus:outline-none"
        aria-label="Beats Per Minute"
      />
    </Slider.Root>
  );
}
