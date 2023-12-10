import { Bpm } from "./content/BpmVisual";
import { MetronomeContext } from "./content/MetronomeContext";
import { PauseButton } from "./content/PauseButton";
import { PercentSpeed } from "./content/PercentSpeed";
import { MetronomeSlider } from "./content/Slider";
import { SoundTypeControls } from "./content/SoundTypeControls";
import { TapIn } from "./content/TapIn";

function App() {
  return (
    <MetronomeContext>
      <div className="font-sans dark:bg-slate-800 text-black dark:text-white h-full items-center flex justify-center">
        <div className="flex flex-col">
          <Bpm />
          <div className="flex gap-2">
            <TapIn />
            <PercentSpeed />
          </div>
          <SoundTypeControls />
          <PauseButton />
        </div>
        <MetronomeSlider />
      </div>
    </MetronomeContext>
  );
}

export default App;
