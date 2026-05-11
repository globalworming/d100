import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: number | null;
  phase: "idle" | "random" | "sorting" | "sorted";
}

export const ResultDisplay = ({ result, phase }: ResultDisplayProps) => {
  return (
    <div className="
      order-1 
      flex items-center justify-center
      w-full 
      text-center
      text-[4rem]
      landscape:order-2 
      landscape:min-w-[8rem] landscape:w-auto 
      landscape:items-start landscape:justify-center">
      <div
        className={cn(
          "mono",
          "text-primary text-glow",
          "transition-all duration-500", 
          phase === "random" && "opacity-30 blur-sm",
          phase === "sorting" && "opacity-60",
          phase === "sorted" && "opacity-100 animate-fade-in-up"
        )}
      >
        {result !== null ? result : "—"}
      </div>
    </div>
  );
};
