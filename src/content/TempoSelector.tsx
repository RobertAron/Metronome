import { MetronomeSlider } from "./Slider";
import { useMetronomeContext } from "./MetronomeContext";

function TempoNudgeButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-12 flex grow items-baseline justify-center border-x-[.5px] border-y border-black px-3 py-1 text-lg first:rounded-l first:border-l last:rounded-r last:border-r hover:bg-amber-500/10 focus:z-10 focus:border-amber-500 focus:shadow-[0_0_0_2px] focus:shadow-amber-500 focus:outline-none data-[state=on]:bg-black data-[state=on]:text-white dark:border-slate-700 dark:focus:bg-amber-500/10"
    >
      {children}
    </button>
  );
}

export function TempoSelector() {
  const { bpm, setBpm } = useMetronomeContext();

  return (
    <>
      <MetronomeSlider />
      <div className="flex justify-between">
        <span className="flex">
          <TempoNudgeButton onClick={() => setBpm(bpm - 10)}>
            -10
          </TempoNudgeButton>
          <TempoNudgeButton onClick={() => setBpm(bpm - 1)}>
            -1
          </TempoNudgeButton>
        </span>
        <span className="flex">
          <TempoNudgeButton onClick={() => setBpm(bpm + 1)}>
            +1
          </TempoNudgeButton>
          <TempoNudgeButton onClick={() => setBpm(bpm + 10)}>
            +10
          </TempoNudgeButton>
        </span>
      </div>
    </>
  );
}
