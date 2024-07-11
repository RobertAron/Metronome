import { inject } from "@vercel/analytics";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import { BeatSelect } from "./content/BeatSelect";
import { Bpm } from "./content/BpmVisual";
import { Footer } from "./content/Footer";
import { MetronomeContext } from "./content/MetronomeContext";
import { MetronomeVisual } from "./content/MetronomeVisual";
import { PauseButton } from "./content/PauseButton";
import { PercentSpeed } from "./content/PercentSpeed";
import { MetronomeSlider } from "./content/Slider";
import { TapIn } from "./content/TapIn";
import { LazyMotion, domAnimation } from "framer-motion";
import { isLocalhost } from "./serviceWorkerRegistration";

inject({
  mode: isLocalhost ? "development" : "auto",
});

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MetronomeContext>
        <div className="flex h-full flex-col justify-between font-sans text-black dark:bg-slate-800 dark:text-white">
          <main className="flex h-full items-center justify-center p-1">
            <h1 className="sr-only">
              Metronome App - tempo, time signature, subdivision, practice
              percentage
            </h1>
            <div className="flex flex-col gap-4">
              <MetronomeVisual />
              <Bpm />
              <MetronomeSlider />
              <TapIn />
              <PercentSpeed />
              <BeatSelect />
              <PauseButton />
            </div>
          </main>
          <Footer />
        </div>
      </MetronomeContext>
      <PwaToaster />
    </LazyMotion>
  );
}

export function PwaToaster() {
  const { toast } = useToast();
  useEffect(() => {
    const handleOfflineReady = () => {
      toast({
        title: "Ready to run offline!",
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
