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

const strokeWidth = 5;
const arcFillMidpoint = 50 - strokeWidth / 2;
const arcFillOuterPoint = 50 + strokeWidth / 2;
export function MetronomeVisual() {
  const { motionRef } = useMetronomeContext();

  return (
    <>
      {/* <div className="relative h-5 w-full bg-zinc-800">
        <motion.div
          style={{ left: motionRef }}
          className="absolute h-5 w-2 bg-white"
        />
      </div> */}
      <div className="w-full">
        <motion.svg
          viewBox={`-50 -50 100 ${arcFillOuterPoint}`}
          // viewBox="-50 -50 100 51.5"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "auto",
          }}
        >
          <motion.path
            d={`M -${arcFillMidpoint} 0 A ${arcFillMidpoint} ${arcFillMidpoint} 0 0 1 ${arcFillMidpoint} 0`}
            // stroke="green"
            className="stroke-slate-900"
            fill="transparent"
            strokeLinecap="round"
            strokeWidth={strokeWidth-1}
            variants={pathVariants}
            initial="initial"
            animate="animate"
          />
          <motion.path
            className="!origin-[0px_0px_0px] fill-amber-500"
            d={circlePath(-arcFillMidpoint, 0, strokeWidth/2)}
            style={{ rotate: motionRef }}
          />
        </motion.svg>
      </div>
    </>
  );
}
