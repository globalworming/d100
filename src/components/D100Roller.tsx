import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { RollButton } from "./RollButton";
import { ResultDisplay } from "./ResultDisplay";
import { RollHistory } from "./RollHistory";
import { FullscreenButton } from "./FullscreenButton";

type Phase = "idle" | "random" | "sorting" | "sorted";

const generateRandomItems = (): boolean[] => {
  return Array.from({ length: 100 }, () => Math.random() > 0.5);
};

const countDots = (items: boolean[]): number => {
  return items.filter(Boolean).length;
};

export const D100Roller = () => {
  const [items, setItems] = useState<boolean[]>(() => generateRandomItems());
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(() => countDots(generateRandomItems()));
  const [history, setHistory] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const roll = useCallback(() => {
    if (phase !== "idle" && phase !== "sorted") return;

    // Start randomizing
    setPhase("random");
    
    // Rapid randomization for visual effect
    let randomCount = 0;
    const randomInterval = setInterval(() => {
      setItems(generateRandomItems());
      randomCount++;
      if (randomCount >= 8) {
        clearInterval(randomInterval);
        
        // Generate final result
        const finalItems = generateRandomItems();
        setItems(finalItems);
        
        // Start sorting
        setPhase("sorting");
        
        // Complete sort after animation
        setTimeout(() => {
          const dotCount = countDots(finalItems);
          setResult(dotCount);
          setHistory((prev) => [dotCount, ...prev]);
          setPhase("sorted");
        }, 1200);
      }
    }, 80);
  }, [phase]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        roll();
      }
      if (e.code === "KeyF") {
        toggleFullscreen();
      }
      if (e.code === "KeyH") {
        setHistoryOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [roll, toggleFullscreen]);

  const isRolling = phase === "random" || phase === "sorting";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <RollHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />

      <div className="w-full max-w-2xl mx-auto">
        <ResultDisplay result={result} phase={phase} />
        <DiceGrid items={items} phase={phase} />
        
        <div className="flex flex-col items-center gap-4 mt-8">
          <RollButton onClick={roll} disabled={isRolling} />
          <p className="text-muted-foreground text-xs font-mono">
            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">Space</kbd> to roll
            {" • "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">F</kbd> fullscreen
            {" • "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">H</kbd> history
          </p>
        </div>
      </div>
    </div>
  );
};
