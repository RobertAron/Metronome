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
import { MetronomeVisual } from "./content/MetronomeVisual";
import { inject } from "@vercel/analytics";

inject();

function App() {
  return (
    <>
      <MetronomeContext>
        <div className="flex h-full items-center justify-center p-1 font-sans text-black dark:bg-slate-800 dark:text-white">
          <div className="flex flex-col gap-4">
            <MetronomeVisual />
            <Bpm />
            <MetronomeSlider />
            <TapIn />
            <PercentSpeed />
            <BeatSelect />
            <PauseButton />
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
    const handleAppUpdated = () => {
      toast({
        title: "Update Complete!",
        description: "Close all tabs to update app.",
      });
    };
    document.addEventListener("appOfflineReady", handleOfflineReady);
    document.addEventListener("appUpdated", handleAppUpdated);
    return () => {
      document.removeEventListener("appOfflineReady", handleOfflineReady);
      document.removeEventListener("appUpdated", handleAppUpdated);
    };
  }, [toast]);
  return <Toaster />;
}

export default App;
