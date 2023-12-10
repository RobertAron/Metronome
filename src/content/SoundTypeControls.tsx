import { BeatType, useMetronomeContext } from "./MetronomeContext";

const cyle: Record<BeatType, BeatType> = {
  primary: "secondary",
  secondary: "rest",
  rest: "primary",
};

export function SoundTypeControls() {
  const { beats, setBeats } = useMetronomeContext();
  return (
    <div>
      {beats.map((ele, index) => (
        <button
          key={index}
          className="border border-black w-36 p-2"
          onClick={() => {
            const newBeats = beats.map((ele, innerIndex) => {
              if (index !== innerIndex) return ele;
              return cyle[ele];
            });
            setBeats(newBeats);
          }}
        >
          {ele}
        </button>
      ))}
    </div>
  );
}
