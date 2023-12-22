import { useMetronomeContext } from "./MetronomeContext";

export function SoundTypeControls() {
  const { beats } = useMetronomeContext();
  return (
    <div className="grid items-center gap-1">
      {beats.map((subbeats, beatIndex) => {
        return [
          ...subbeats.map((beatType, subBeatIndex) => {
            return (
              <div
                key={`${beatIndex}-${subBeatIndex}`}
                style={{
                  gridColumnStart: beatIndex + 1,
                  gridRowStart: subBeatIndex + 1,
                }}
                className="rounded-full bg-purple-500 p-1 aspect-square"
              >
                ·
              </div>
            );
          }),
        ];
      })}
    </div>
  );
}
