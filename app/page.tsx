import Link from "next/link";
import {
  Box,
  Eye,
  Workflow,
  Cog,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Zap,
} from "lucide-react";
import { ArchitecturePreview } from "@/components/architecture-preview";

const features = [
  {
    icon: Box,
    title: "pContainers",
    description: "Distributed data structures that partition data across processing locations automatically.",
    href: "/concepts/pcontainer",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: Eye,
    title: "pViews",
    description: "Abstract interfaces providing uniform access to distributed data with lazy evaluation.",
    href: "/concepts/pview",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Workflow,
    title: "PARAGRAPHs",
    description: "Task dependency graphs for dynamic scheduling and efficient parallel execution.",
    href: "/concepts/paragraph",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Cog,
    title: "Skeletons",
    description: "High-level parallel patterns like map, reduce, and scan that compose naturally.",
    href: "/concepts/skeleton",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
];

const quickLinks = [
  {
    icon: BookOpen,
    title: "Core Concepts",
    description: "Start with the fundamental building blocks",
    href: "/concepts",
  },
  {
    icon: Layers,
    title: "Memory Model",
    description: "Visualize distributed ownership",
    href: "/memory-model",
  },
  {
    icon: GraduationCap,
    title: "Study Tools",
    description: "Flashcards and quizzes",
    href: "/study",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Zap className="h-3 w-3 text-primary" />
                Interactive Learning Platform
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                Master the <span className="text-primary">STAPL</span> Framework
              </h1>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Deep dive into the Standard Template Adaptive Parallel Library with 
                interactive visualizations, code examples, and comprehensive study tools.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/concepts"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/memory-model"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  View Visualizations
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ArchitecturePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Core Components Grid */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">Core Components</h2>
          <p className="mt-2 text-muted-foreground">
            The four pillars of STAPL parallel programming
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}>
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* STL Comparison Banner */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-screen-xl px-4 py-12 lg:px-8">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-foreground">
                From STL to Parallel Computing
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                STAPL extends familiar C++ Standard Library concepts to distributed memory systems. 
                If you know STL, you are already halfway there.
              </p>
            </div>
            <Link
              href="/cpp-mapping"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              View C++ to STAPL Mapping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Research Papers Teaser */}
      <section className="border-t border-border bg-gradient-to-b from-card/50 to-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Based on Research</h2>
            <p className="mt-2 text-muted-foreground">
              STAPL is backed by peer-reviewed publications from leading conferences
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {["PPoPP", "SC", "IPDPS", "HPDC", "LCPC"].map((venue) => (
                <span
                  key={venue}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
                >
                  {venue}
                </span>
              ))}
            </div>
            <Link
              href="/papers"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Browse Research Papers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
