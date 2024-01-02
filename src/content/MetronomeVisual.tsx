import { motion } from "framer-motion";
import { useMetronomeContext } from "./MetronomeContext";

const pathVariants = {
  initial: {
    pathLength: 1,
    pathOffset: -1,
  },
  animate: {
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

function circlePath(x: number, y: number, r: number) {
  return `
  M ${x - r}, ${y}
  a ${r},${r} 0 1,0 ${r * 2},0
  a ${r},${r} 0 1,0 -${r * 2},0
  `;
}
function circlePoints(furthestRadius: number, width: number) {
  const strokeWidth = width;
  const halfStroke = strokeWidth / 2;
  const arcFillMidpoint = furthestRadius - halfStroke;
  const arcFillOuterPoint = furthestRadius + halfStroke;
  return {
    strokeWidth,
    arcFillMidpoint,
    arcFillOuterPoint,
    halfStroke,
  };
}

const outer = circlePoints(50, 5);
const smaller = circlePoints(49.5, 4);
// const { strokeWidth, arcFillMidpoint, arcFillOuterPoint } = circlePoints(50, 4);

export function MetronomeVisual() {
  const { motionRef } = useMetronomeContext();

  return (
    <div className="w-full">
      <motion.svg
        viewBox={`-${outer.arcFillOuterPoint} -${outer.arcFillOuterPoint} ${
          outer.arcFillOuterPoint * 2
        } ${outer.arcFillOuterPoint + outer.strokeWidth}`}
        // viewBox={`-50 -50 100 ${outer.arcFillOuterPoint}`}
        // viewBox="-50 -50 100 51.5"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "auto",
        }}
      >
        <motion.path
          d={`M -${smaller.arcFillMidpoint} 0 A ${smaller.arcFillMidpoint} ${smaller.arcFillMidpoint} 0 0 1 ${smaller.arcFillMidpoint} 0`}
          // stroke="green"
          className="stroke-slate-900"
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={smaller.strokeWidth}
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />
        <motion.path
          className="!origin-[0px_0px_0px] fill-amber-500"
          d={circlePath(-outer.arcFillMidpoint, 0, outer.strokeWidth / 2)}
          style={{ rotate: motionRef }}
        />
      </motion.svg>
    </div>
  );
}
