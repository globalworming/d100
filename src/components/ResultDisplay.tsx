import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: number | null;
  phase: "idle" | "random" | "sorting" | "sorted";
}

export const ResultDisplay = ({ result, phase }: ResultDisplayProps) => {
  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "result-display text-primary text-glow transition-all duration-500",
          phase === "random" && "opacity-30 blur-sm",
          phase === "sorting" && "opacity-60",
          phase === "sorted" && "opacity-100 animate-fade-in-up"
        )}
      >
        {result !== null ? result : "—"}
      </div>
      <p className="text-muted-foreground text-sm mt-2 font-mono uppercase tracking-widest">
        {phase === "idle" && "Ready to roll"}
        {phase === "random" && "Randomizing..."}
        {phase === "sorting" && "Counting dots..."}
        {phase === "sorted" && result !== null && `${result} dots found`}
      </p>
    </div>
  );
};
