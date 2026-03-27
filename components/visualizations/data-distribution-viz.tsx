"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type DistributionType = "block" | "cyclic" | "block-cyclic";

const locationColors = [
  "bg-chart-1",
  "bg-chart-2", 
  "bg-chart-3",
  "bg-chart-4",
];

const locationBorders = [
  "border-chart-1",
  "border-chart-2",
  "border-chart-3", 
  "border-chart-4",
];

export function DataDistributionViz() {
  const [distribution, setDistribution] = useState<DistributionType>("block");
  const [numLocations, setNumLocations] = useState(4);
  const [blockSize, setBlockSize] = useState(4);
  
  const totalElements = 16;
  
  const getLocationForElement = (index: number): number => {
    switch (distribution) {
      case "block":
        return Math.floor(index / (totalElements / numLocations));
      case "cyclic":
        return index % numLocations;
      case "block-cyclic":
        const block = Math.floor(index / blockSize);
        return block % numLocations;
      default:
        return 0;
    }
  };

  const elements = Array.from({ length: totalElements }, (_, i) => ({
    index: i,
    location: getLocationForElement(i),
  }));

  const descriptions: Record<DistributionType, string> = {
    block: "Contiguous chunks assigned to each location. Good for algorithms with locality.",
    cyclic: "Round-robin assignment. Better load balance for irregular workloads.",
    "block-cyclic": "Blocks assigned cyclically. Balances locality and load distribution.",
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Distribution:</span>
          <div className="flex rounded-lg border border-border bg-background p-1">
            {(["block", "cyclic", "block-cyclic"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDistribution(type)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  distribution === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {distribution === "block-cyclic" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Block size:</span>
            <select
              value={blockSize}
              onChange={(e) => setBlockSize(Number(e.target.value))}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="p-6">
        {/* Array visualization */}
        <div className="mb-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Array Elements (indices 0-15)
          </div>
          <div className="flex flex-wrap gap-1">
            {elements.map((el, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`flex h-10 w-10 items-center justify-center rounded-md border-2 text-xs font-mono font-medium text-foreground ${locationColors[el.location]}/20 ${locationBorders[el.location]}`}
              >
                {el.index}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Per-location breakdown */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: numLocations }, (_, loc) => {
            const locElements = elements.filter((el) => el.location === loc);
            return (
              <motion.div
                key={loc}
                layout
                className={`rounded-lg border-2 p-3 ${locationBorders[loc]} bg-card`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${locationColors[loc]}`} />
                  <span className="text-sm font-medium text-foreground">
                    Location {loc}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {locElements.length} elements
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {locElements.map((el) => (
                    <motion.span
                      key={el.index}
                      layout
                      className={`flex h-6 w-6 items-center justify-center rounded text-xs font-mono ${locationColors[loc]}/30`}
                    >
                      {el.index}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">{descriptions[distribution]}</p>
      </div>
    </div>
  );
}
