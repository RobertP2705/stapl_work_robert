"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  name: string;
  description: string;
  code: string;
  locations: {
    id: string;
    values: string[];
    highlight?: boolean;
  }[];
  arrows?: { from: number; to: number }[];
}

const steps: Step[] = [
  {
    name: "Initial Data",
    description: "Distributed array with 16 elements across 4 locations",
    code: "stapl::array<int> arr(16);",
    locations: [
      { id: "L0", values: ["1", "2", "3", "4"] },
      { id: "L1", values: ["5", "6", "7", "8"] },
      { id: "L2", values: ["9", "10", "11", "12"] },
      { id: "L3", values: ["13", "14", "15", "16"] },
    ],
  },
  {
    name: "Map: Square",
    description: "Apply square function to each element in parallel",
    code: "stapl::map_func([](int x){ return x*x; }, view);",
    locations: [
      { id: "L0", values: ["1", "4", "9", "16"], highlight: true },
      { id: "L1", values: ["25", "36", "49", "64"], highlight: true },
      { id: "L2", values: ["81", "100", "121", "144"], highlight: true },
      { id: "L3", values: ["169", "196", "225", "256"], highlight: true },
    ],
  },
  {
    name: "Local Reduce",
    description: "Each location sums its local elements",
    code: "// Local reduction at each location",
    locations: [
      { id: "L0", values: ["30"], highlight: true },
      { id: "L1", values: ["174"], highlight: true },
      { id: "L2", values: ["446"], highlight: true },
      { id: "L3", values: ["846"], highlight: true },
    ],
  },
  {
    name: "Global Reduce",
    description: "Combine local results into final answer",
    code: "stapl::reduce(view, stapl::plus<int>());",
    locations: [
      { id: "L0", values: ["30"] },
      { id: "L1", values: ["174"] },
      { id: "L2", values: ["446"] },
      { id: "L3", values: ["846"] },
    ],
    arrows: [
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 3, to: 2 },
    ],
  },
  {
    name: "Result",
    description: "Final sum of squares: 1496",
    code: "// Result: 1496 (sum of 1² + 2² + ... + 16²)",
    locations: [
      { id: "L0", values: [""] },
      { id: "L1", values: [""] },
      { id: "L2", values: ["1496"], highlight: true },
      { id: "L3", values: [""] },
    ],
  },
];

export function SkeletonCompositionViz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Auto-play effect
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div>
          <h3 className="font-semibold text-foreground">{step.name}</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex h-1 bg-muted">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`flex-1 transition-colors ${
              i <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Visualization */}
      <div className="relative p-6">
        <div className="flex justify-center gap-4">
          <AnimatePresence mode="wait">
            {step.locations.map((loc, locIndex) => (
              <motion.div
                key={`${currentStep}-${loc.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: locIndex * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Location label */}
                <div className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {loc.id}
                </div>

                {/* Data box */}
                <div
                  className={`flex min-h-[100px] min-w-[80px] flex-col items-center justify-center rounded-lg border-2 p-3 transition-all ${
                    loc.highlight
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  {loc.values.map((val, valIndex) => (
                    <motion.span
                      key={valIndex}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: locIndex * 0.1 + valIndex * 0.05 }}
                      className={`font-mono text-sm ${
                        loc.highlight ? "font-semibold text-primary" : "text-foreground"
                      }`}
                    >
                      {val || "\u00A0"}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Communication arrows for global reduce */}
        {step.arrows && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {step.arrows.map((arrow, i) => (
                <motion.path
                  key={i}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                  d={`M ${100 + arrow.from * 100} 120 Q ${100 + ((arrow.from + arrow.to) / 2) * 100} 60 ${100 + arrow.to * 100} 120`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4,4"
                />
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Code */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <code className="font-mono text-sm text-chart-2">{step.code}</code>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 border-t border-border bg-background px-4 py-3">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentStep
                ? "w-6 bg-primary"
                : i < currentStep
                ? "bg-primary/50"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
