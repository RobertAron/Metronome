import { cn } from "../other/cn";
import { useMetronomeContext } from "./MetronomeContext";

export function PercentSpeed() {
  const { percentSpeed, setPercentSpeed } = useMetronomeContext();
  return (
    <>
      {new Array(6).fill(null).map((_, index) => {
        const buttonPercent = index / 10 + 0.5;
        return (
          <button
            key={index}
            className={cn("p-2 bg-cyan-400 flex-grow", {
              "bg-green-300": percentSpeed === buttonPercent,
            })}
            onClick={() => setPercentSpeed(buttonPercent)}
          >
            {buttonPercent * 100}%
          </button>
        );
      })}
    </>
  );
}
