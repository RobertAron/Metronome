import { useMetronomeContext } from "./MetronomeContext";
import * as Slider from "@radix-ui/react-slider";

export function MetronomeSlider() {
  const { bpm, setBpm } = useMetronomeContext();
  // should have slider
  // text exit
  // tap in
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none h-[200px] w-5"
      defaultValue={[100]}
      max={300}
      min={40}
      step={1}
      value={[bpm]}
      onValueChange={([newVal]) => setBpm(newVal)}
      orientation="vertical"
    >
      <Slider.Track className="bg-slate-600 relative grow rounded-full w-[3px] h-full">
        <Slider.Range className="absolute bg-white rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blue-800 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-red-600"
        aria-label="Volume"
      />
    </Slider.Root>
  );
}
