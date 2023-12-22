import { useEffect, useRef } from "react";
import VF from "vexflow";
import { RhythmConfig } from "../other/rhythmOptions";
const width = 300;
const height = 61;
// need 1 extar px to make fit
const staveWidth = 299;

export function Vexflow({ rhythmConfig }: { rhythmConfig: RhythmConfig }) {
  const ref = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const renderer = new VF.Renderer(ref.current, VF.RendererBackends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();
    const stave = new VF.Stave(0, -20, staveWidth, {})
      .addTimeSignature(rhythmConfig.timeSignature)
      .setContext(context)
      .draw();
    const beams = VF.Beam.generateBeams(rhythmConfig.notes);
    VF.Formatter.FormatAndDraw(context, stave, rhythmConfig.notes);
    for (const beam of beams) {
      beam.setContext(context).draw();
    }
    const { current } = ref;
    return () => current.replaceChildren();
  }, [rhythmConfig]);
  return <div ref={ref} />;
}
