import { BeatType } from "../content/MetronomeContext";

export type RhythmConfig = {
  id: string;
  itemLabel: string;
  metronomeBeats: BeatType[][];
};

function createSecondaryArray(rows: number, columns: number): BeatType[][] {
  const beats: BeatType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => "secondary"),
  );
  beats[0][0] = "primary";
  return beats;
}

function rawBasic(topNumber: number): RhythmConfig[] {
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
      itemLabel: `${topNumber}/4 - Quarter Notes`,
      metronomeBeats: basic44,
    },
    {
      id: `${topNumber}/4-8th`,
      itemLabel: `${topNumber}/4 - Eighth Notes`,
      metronomeBeats: basic8ths,
    },
    {
      id: `${topNumber}/4-triplets`,
      itemLabel: `${topNumber}/4 - Triplets`,
      metronomeBeats: basicTriplets,
    },
    {
      id: `${topNumber}/4-swung`,
      itemLabel: `${topNumber}/4 - Swung`,
      metronomeBeats: basicSwung,
    },
    {
      id: `${topNumber}/4-Sixteenth`,
      itemLabel: `${topNumber}/4 - Sixteenth Notes`,
      metronomeBeats: basicSixteenths,
    },
  ];
}

export const rhythmOptions: RhythmConfig[] = [
  ...rawBasic(1).map((ele) => {
    ele.id = ele.id.replace("1/4", "No Stressed Beat");
    ele.itemLabel = ele.itemLabel.replace("1/4", "No Stressed Beat");
    return ele;
  }),
  ...rawBasic(4),
  ...rawBasic(3),
  ...rawBasic(2),
  {
    id: `6/8-basic`,
    itemLabel: `6/8 - Dotted Quarter`,
    metronomeBeats: [["primary"], ["secondary"]],
  },
  {
    id: `6/8-triplets`,
    itemLabel: `6/8 - Triplets`,
    metronomeBeats: [
      ["primary", "secondary", "secondary"],
      ["secondary", "secondary", "secondary"],
    ],
  },
  ...rawBasic(5),
];
