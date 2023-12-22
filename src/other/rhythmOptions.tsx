import v from "vexflow";
import { BeatType } from "../content/MetronomeContext";

export type RhythmConfig = {
  id: string;
  timeSignature: string;
  notes: v.StemmableNote[];
  metronomeBeats: BeatType[][];
};

export const rhythmOptions: RhythmConfig[] = [
  {
    id: "44-basic",
    timeSignature: "4/4",
    notes: [
      new v.StaveNote({
        keys: ["f/5"],
        duration: "q",
      }).addModifier(new v.Articulation("a^")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "q",
      }).addModifier(new v.Articulation("a>")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "q",
      }).addModifier(new v.Articulation("a>")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "q",
      }).addModifier(new v.Articulation("a>")),
    ],
    metronomeBeats: [["primary"], ["secondary"], ["secondary"], ["secondary"]],
  },
  {
    id: "44-8th",
    timeSignature: "4/4",
    notes: [
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }).addModifier(new v.Articulation("a^")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }).addModifier(new v.Articulation("a>")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }).addModifier(new v.Articulation("a>")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }).addModifier(new v.Articulation("a>")),
      new v.StaveNote({
        keys: ["f/5"],
        duration: "8",
      }),
    ],
    metronomeBeats: [
      ["primary", "secondary"],
      ["secondary", "secondary"],
      ["secondary", "secondary"],
      ["secondary", "secondary"],
    ],
  },
];
