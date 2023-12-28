import { BeatType } from "../content/MetronomeContext";

export type RhythmConfig = {
  id: string;
  itemLabel: React.ReactNode;
  metronomeBeats: BeatType[][];
};

function createSecondaryArray(rows: number, columns: number): BeatType[][] {
  const beats: BeatType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => "secondary")
  );
  beats[0][0] = "primary";
  return beats;
}

function rawBasic(topNumber: number) {
  const basic44 = createSecondaryArray(topNumber, 1);
  const basic8ths = createSecondaryArray(topNumber, 2);
  const basicTriplets = createSecondaryArray(topNumber, 3);
  const basicSwung = createSecondaryArray(topNumber, 3).map((ele) => {
    ele[1] = "rest";
    return ele;
  });
  const basicSixteenths = createSecondaryArray(topNumber, 4);
  return [
    {
      id: `${topNumber}/4-basic`,
      itemLabel: <div>{topNumber}/4 - Quarter Notes</div>,
      metronomeBeats: basic44,
    },
    {
      id: `${topNumber}/4-8th`,
      itemLabel: <div>{topNumber}/4 - Eighth Notes</div>,
      metronomeBeats: basic8ths,
    },
    {
      id: `${topNumber}/4-triplets`,
      itemLabel: <div>{topNumber}/4 - Triplets</div>,
      metronomeBeats: basicTriplets,
    },
    {
      id: `${topNumber}/4-swung`,
      itemLabel: <div>{topNumber}/4 - Swung</div>,
      metronomeBeats: basicSwung,
    },
    {
      id: `${topNumber}/4-Sixteenth`,
      itemLabel: <div>{topNumber}/4 - Sixteenth Notes</div>,
      metronomeBeats: basicSixteenths,
    },
  ];
}

export const rhythmOptions: RhythmConfig[] = [
  ...rawBasic(4),
  ...rawBasic(3),
  ...rawBasic(2),
  {
    id: `6/8-basic`,
    itemLabel: <div>6/8 - Dotted Quarter</div>,
    metronomeBeats: [["primary"], ["secondary"]],
  },
  {
    id: `6/8-triplets`,
    itemLabel: <div>6/8 - Triplets</div>,
    metronomeBeats: [
      ["primary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary"],
    ],
  },
  ...rawBasic(5),
];
