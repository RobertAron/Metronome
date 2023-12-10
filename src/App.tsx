import { Bpm } from "./content/BpmVisual";
import { MetronomeContext } from "./content/MetronomeContext";
import { PauseButton } from "./content/PauseButton";
import { MetronomeSlider } from "./content/Slider";
import { SoundTypeControls } from "./content/SoundTypeControls";
import { TapIn } from "./content/TapIn";

function App() {
  return (
    <MetronomeContext>
      <div className="font-sans dark:bg-slate-800 text-black dark:text-white h-full items-center flex justify-center">
        <div className="flex flex-col">
          <Bpm />
          <TapIn />
          <SoundTypeControls />
          <PauseButton />
        </div>
        <MetronomeSlider />
      </div>
    </MetronomeContext>
  );
}

export default App;
