import { MetronomeContext } from "./content/MetronomeContext";
import { PauseButton } from "./content/PauseButton";
import { MetronomeSlider } from "./content/Slider";
import { TapIn } from "./content/TapIn";

function App() {
  return (
    <MetronomeContext>
      <div className="font-sans bg-neutral-800 text-white flex flex-col h-full items-center">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <PauseButton />
        <MetronomeSlider />
        <TapIn />
      </div>
    </MetronomeContext>
  );
}

export default App;
