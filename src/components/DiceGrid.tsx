import { DiceItem } from "./DiceItem";

interface DiceGridProps {
  items: boolean[];
  phase: "idle" | "random" | "sorting" | "sorted";
}

export const DiceGrid = ({ items, phase }: DiceGridProps) => {
  // Create sorted indices - falses first, then trues
  const sortedIndices = items
    .map((hasDot, originalIndex) => ({ hasDot, originalIndex }))
    .sort((a, b) => {
      if (a.hasDot === b.hasDot) return a.originalIndex - b.originalIndex;
      return a.hasDot ? 1 : -1;
    })
    .map((item, sortedPosition) => ({
      originalIndex: item.originalIndex,
      sortedPosition,
    }));

  const getSortedIndex = (originalIndex: number) => {
    return sortedIndices.find((s) => s.originalIndex === originalIndex)?.sortedPosition ?? originalIndex;
  };

  return (
    <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-full max-w-lg mx-auto p-4">
      {items.map((hasDot, index) => (
        <DiceItem
          key={index}
          hasDot={hasDot}
          index={index}
          phase={phase === "idle" ? "sorted" : phase}
          sortedIndex={getSortedIndex(index)}
        />
      ))}
    </div>
  );
};
