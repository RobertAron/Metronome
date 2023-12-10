import { BeatType, useMetronomeContext } from "./MetronomeContext";

const cyle: Record<BeatType, BeatType> = {
  primary: "secondary",
  secondary: "rest",
  rest: "primary",
};

export function SoundTypeControls() {
  const { beats, setBeats } = useMetronomeContext();
  return (
    <div className="grid">
      {beats.map((subbeats, beatIndex) => {
        return subbeats.map((beatType, subBeatIndex) => {
          return (
            <button
              style={{
                gridColumnStart: beatIndex+1,
                gridRowStart: subBeatIndex+1,
              }}
              key={`${beatIndex}-${subBeatIndex}`}
              onClick={() => {
                const beatsCopy = [...beats];
                const beatToUpdate = [...beats[beatIndex]];
                beatToUpdate[subBeatIndex] = cyle[beatType];
                beatsCopy[beatIndex] = beatToUpdate;
                setBeats(beatsCopy);
              }}
            >
              {beatType}
            </button>
          );
        });
      })}
      <button
        onClick={() => {
          return setBeats(beats.map((oldBeat) => [...oldBeat, "secondary"]));
        }}
      >
        more
      </button>
    </div>
  );
}
