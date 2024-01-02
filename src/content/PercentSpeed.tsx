import { useMetronomeContext } from "./MetronomeContext";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

export function PercentSpeed() {
  const { percentSpeed, setPercentSpeed } = useMetronomeContext();
  return (
    <ToggleGroup.Root
      className="flex w-full rounded"
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
            className="flex grow items-baseline justify-center border-x-[.5px] border-y border-black dark:border-slate-700 px-3 py-1 text-lg first:rounded-l first:border-l last:rounded-r last:border-r hover:bg-amber-500/10 focus:z-10 focus:border-amber-500 focus:shadow-[0_0_0_2px] focus:shadow-amber-500 focus:outline-none data-[state=on]:bg-black data-[state=on]:text-white dark:focus:bg-amber-500/10"
          >
            <span>{buttonPercent * 100}</span>
            <span className="text-sm">%</span>
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}
