/* eslint-disable @typescript-eslint/no-unused-vars */
import {motion, useMotionValue} from 'framer-motion'
import { useMetronomeContext } from './MetronomeContext';
import { useEffect } from 'react';


export function MetronomeVisual() {
  const x = useMotionValue(0)
  const metronome = useMetronomeContext()

  useEffect(()=>{

  })
  return (
    <div className="relative h-1 w-full bg-zinc-800">
      <motion.div className="h-1 w-1 bg-white" />
    </div>
  );
}
