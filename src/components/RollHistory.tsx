import { useMemo } from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { History, X } from "lucide-react";

interface RollHistoryProps {
  history: number[];
  isOpen: boolean;
  onToggle: () => void;
}

export const RollHistory = ({ history, isOpen, onToggle }: RollHistoryProps) => {
  const distribution = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const start = index * 10 + 1;
        const end = start + 9;
        const count = history.filter((roll) => roll >= start && roll <= end).length;

        return {
          bucket: `${String(start).padStart(2, "0")}-${String(end).padStart(2, "0")}`,
          count,
          active: count > 0,
        };
      }),
    [history]
  );

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-4 right-4 z-50 p-3 rounded-lg glass",
          "hover:bg-secondary/80 transition-colors",
          "flex items-center gap-2"
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <History className="w-5 h-5" />}
        {!isOpen && history.length > 0 && (
          <span className="text-sm font-mono text-muted-foreground">
            ({history.length})
          </span>
        )}
      </button>

      {/* History panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 glass z-40",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Roll History
          </h2>

          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No rolls yet</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/30 bg-secondary/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Distribution
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {history.length} rolls
                  </span>
                </div>

                <ChartContainer
                  config={{
                    count: {
                      label: "Rolls",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[100px] w-full"
                >
                  <BarChart data={distribution} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                    <XAxis
                      dataKey="bucket"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={1}
                      tick={{ fontSize: 9 }}
                      tickFormatter={(value: string) => value.slice(0, 2)}
                    />
                    <YAxis hide domain={[0, "dataMax + 1"]} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => `${value}`}
                          formatter={(value) => [
                            <span className="font-mono tabular-nums">{value}</span>,
                            "Rolls",
                          ]}
                        />
                      }
                    />
                    <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={14}>
                      {distribution.map((entry) => (
                        <Cell
                          key={entry.bucket}
                          fill={entry.active ? "var(--color-count)" : "hsl(var(--muted))"}
                          fillOpacity={entry.active ? 0.9 : 0.35}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-290px)] overflow-y-auto pr-1">
                {history.map((roll, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      "bg-secondary/50 border border-border/30",
                      index === 0 && "animate-fade-in-up border-primary/30"
                    )}
                  >
                    <span className="text-muted-foreground text-sm">
                      #{history.length - index}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-xl font-bold",
                        index === 0 && "text-primary text-glow"
                      )}
                    >
                      {roll}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};
