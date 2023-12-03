import { MetronomeContext } from "./content/MetronomeContext";
import { PauseButton } from "./content/PauseButton";
import { MetronomeSlider } from "./content/Slider";
import { SoundTypeControls } from "./content/SoundTypeControls";
import { TapIn } from "./content/TapIn";

function App() {
  return (
    <MetronomeContext>
      <div className="font-sans dark:bg-slate-800 text-black dark:text-white flex flex-col h-full items-center">
        <MetronomeSlider />
        <TapIn />
        <SoundTypeControls />
        <PauseButton />
      </div>
    </MetronomeContext>
  );
}

export default App;
