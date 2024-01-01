import { motion } from "framer-motion";
import { useMetronomeContext } from "./MetronomeContext";

export function MetronomeVisual() {
  const { motionRef } = useMetronomeContext();

  return (
    <div className="relative h-5 w-full bg-zinc-800">
      <motion.div
        style={{ left: motionRef }}
        className="absolute h-5 w-2 bg-white"
      />
    </div>
  );
}
