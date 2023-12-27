import { BeatType } from "../content/MetronomeContext";

export type RhythmConfig = {
  id: string;
  itemLabel: React.ReactNode;
  metronomeBeats: BeatType[][];
};

export const rhythmOptions: RhythmConfig[] = [
  {
    id: "44-basic",
    itemLabel: <div>4/4 - Quarter Notes</div>,
    metronomeBeats: [["primary"], ["secondary"], ["secondary"], ["secondary"]],
  },
  {
    id: "44-8th",
    itemLabel: <div>4/4 - Eighth Notes</div>,
    metronomeBeats: [
      ["primary", "secondary"],
      ["secondary", "secondary"],
      ["secondary", "secondary"],
      ["secondary", "secondary"],
    ],
  },
  {
    id: "44-triplets",
    itemLabel: <div>4/4 - Triplets</div>,
    metronomeBeats: [
      ["primary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary"],
    ],
  },
  {
    id: "44-swung",
    itemLabel: <div>4/4 - Swung</div>,
    metronomeBeats: [
      ["primary", "rest", "secondary"],
      ["secondary", "rest", "secondary"],
      ["secondary", "rest", "secondary"],
      ["secondary", "rest", "secondary"],
    ],
  },
  {
    id: "44-Sixteenth",
    itemLabel: <div>4/4 - Sixteenth Notes</div>,
    metronomeBeats: [
      ["primary", "secondary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary", "secondary"],
    ],
  },
];
