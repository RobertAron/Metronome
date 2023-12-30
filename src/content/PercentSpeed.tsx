import { useMetronomeContext } from "./MetronomeContext";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

export function PercentSpeed() {
  const { percentSpeed, setPercentSpeed } = useMetronomeContext();
  return (
    <ToggleGroup.Root
      className="flex rounded w-full"
      type="single"
      defaultValue={`${percentSpeed}`}
      aria-label="Beats Per Minute Percentage Modifier"
      onValueChange={(val) => {
        const newValue = Number(val);
        if (!isNaN(newValue)) setPercentSpeed(newValue);
      }}
    >
      {new Array(6).fill(null).map((_, index) => {
        const buttonPercent = index / 10 + 0.5;
        return (
          <ToggleGroup.Item
            key={`${buttonPercent}`}
            value={`${buttonPercent}`}
            aria-label={`${buttonPercent * 100}% Speed`}
            className="grow hover:bg-amber-200 border-y border-x-[.5px] first:border-l last:border-r border-zinc-900 focus:border-amber-500 data-[state=on]:bg-slate-900 data-[state=on]:text-white flex h-[35px] items-center justify-center text-base first:rounded-l last:rounded-r focus:outline-none focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-amber-500 py-1 px-3"
          >
            {buttonPercent * 100}%
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}
