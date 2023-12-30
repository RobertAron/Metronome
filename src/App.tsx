import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import { BeatSelect } from "./content/BeatSelect";
import { Bpm } from "./content/BpmVisual";
import { MetronomeContext } from "./content/MetronomeContext";
import { PauseButton } from "./content/PauseButton";
import { PercentSpeed } from "./content/PercentSpeed";
import { MetronomeSlider } from "./content/Slider";
import { TapIn } from "./content/TapIn";

function App() {
  return (
    <>
      <MetronomeContext>
        <div className="font-sans dark:bg-slate-800 text-black dark:text-white h-full items-center flex justify-center p-1">
          <div className="flex gap-2">
            <div className="flex flex-col gap-4">
              <Bpm />
              <MetronomeSlider />
              <TapIn />
              <PercentSpeed />
              <BeatSelect />
              <PauseButton />
            </div>
          </div>
        </div>
      </MetronomeContext>
      <PwaToaster />
    </>
  );
}

export function PwaToaster() {
  const { toast } = useToast();
  useEffect(() => {
    const handleOfflineReady = () => {
      toast({
        title: "Ready to work offline!",
      });
    };
    document.addEventListener("appOfflineReady", handleOfflineReady);
    return () => {
      document.removeEventListener("appOfflineReady", handleOfflineReady);
    };
  }, [toast]);
  return <Toaster />;
}

export default App;
