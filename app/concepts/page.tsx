import Link from "next/link";
import { concepts } from "@/lib/stapl-data";
import {
  Box,
  Eye,
  Workflow,
  Cog,
  MapPin,
  Shuffle,
  Network,
  Radio,
  Zap,
  Combine,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pcontainer: Box,
  pview: Eye,
  paragraph: Workflow,
  skeleton: Cog,
  location: MapPin,
  distribution: Shuffle,
  workfunction: Network,
  rmi: Radio,
  algorithm: Zap,
  composition: Combine,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  container: { bg: "bg-chart-1/10", text: "text-chart-1", border: "border-chart-1/30" },
  view: { bg: "bg-chart-2/10", text: "text-chart-2", border: "border-chart-2/30" },
  core: { bg: "bg-chart-3/10", text: "text-chart-3", border: "border-chart-3/30" },
  skeleton: { bg: "bg-chart-4/10", text: "text-chart-4", border: "border-chart-4/30" },
  algorithm: { bg: "bg-chart-5/10", text: "text-chart-5", border: "border-chart-5/30" },
  communication: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
};

export const metadata = {
  title: "Core Concepts - STAPL Framework",
  description: "Learn the fundamental concepts of the STAPL parallel computing framework",
};

export default function ConceptsPage() {
  const grouped = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = [];
    }
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, typeof concepts>);

  const categoryOrder = ["core", "container", "view", "skeleton", "algorithm", "communication"];
  const categoryLabels: Record<string, string> = {
    core: "Core Abstractions",
    container: "Parallel Containers",
    view: "Parallel Views",
    skeleton: "Algorithmic Skeletons",
    algorithm: "Parallel Algorithms",
    communication: "Communication",
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Core Concepts</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Master the fundamental building blocks of STAPL parallel programming
        </p>
      </div>

      {/* Quick navigation */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categoryOrder.map((cat) => {
          const colors = categoryColors[cat];
          return (
            <a
              key={cat}
              href={`#${cat}`}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors hover:bg-accent ${colors.border} ${colors.text}`}
            >
              {categoryLabels[cat]}
            </a>
          );
        })}
      </div>

      {/* Concepts by category */}
      <div className="space-y-12">
        {categoryOrder.map((category) => {
          const items = grouped[category];
          if (!items) return null;
          
          const colors = categoryColors[category];

          return (
            <section key={category} id={category}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`h-1 w-8 rounded-full ${colors.bg} ${colors.text.replace('text-', 'bg-')}`} />
                <h2 className="text-xl font-semibold text-foreground">
                  {categoryLabels[category]}
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((concept) => {
                  const Icon = iconMap[concept.id] || Box;
                  
                  return (
                    <Link
                      key={concept.id}
                      href={`/concepts/${concept.id}`}
                      className={`group flex flex-col rounded-xl border bg-card p-5 transition-all hover:shadow-lg ${colors.border} hover:border-primary/50`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                          <Icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary">
                            {concept.title}
                          </h3>
                          {concept.cppEquivalent && (
                            <span className="text-xs text-muted-foreground">
                              C++: {concept.cppEquivalent}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 flex-1 text-sm text-muted-foreground">
                        {concept.shortDescription}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {concept.relatedConcepts.slice(0, 3).map((rel) => (
                          <span
                            key={rel}
                            className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
