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
        return [
          <button
            style={{
              gridColumnStart: beatIndex + 2,
              gridRowStart: 1,
            }}
            onClick={() =>
              setBeats(beats.filter((_, index) => index !== beatIndex))
            }
          >
            -
          </button>,
          ...subbeats.map((beatType, subBeatIndex) => {
            return (
              <button
                style={{
                  gridColumnStart: beatIndex + 2,
                  gridRowStart: subBeatIndex + 2,
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
          }),
        ];
      })}
      {/* remove subdivisions */}
      {beats[0].map((_, subBeatIndex) => {
        return (
          <button
            style={{ gridColumnStart: 1, gridRowStart: subBeatIndex + 2 }}
            onClick={() =>
              setBeats(
                beats.map((subbeat) =>
                  subbeat.filter((_, index) => index !== subBeatIndex)
                )
              )
            }
          >
            -
          </button>
        );
      })}
      <button
        style={{
          gridRowStart: beats[0].length + 2,
          gridColumn: `2 / ${beats.length + 2}`,
        }}
        className="bg-orange-400"
        onClick={() => {
          return setBeats(beats.map((oldBeat) => [...oldBeat, "secondary"]));
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          return setBeats([
            ...beats,
            new Array(beats[0].length).fill("secondary"),
          ]);
        }}
        className="bg-orange-400"
        style={{
          gridColumnStart: beats.length + 2,
          gridRow: `2 / ${beats[0].length + 2}`,
        }}
      >
        +
      </button>
    </div>
  );
}
