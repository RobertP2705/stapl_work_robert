import Link from "next/link";
import { flashCards } from "@/lib/stapl-data";
import { GraduationCap, Brain, BookOpen, Target, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Study Tools - STAPL Framework",
  description: "Master STAPL concepts with interactive flashcards and quizzes",
};

const categories = [
  ...new Set(flashCards.map((card) => card.category)),
];

const difficultyColors = {
  beginner: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  intermediate: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  advanced: "bg-chart-5/10 text-chart-5 border-chart-5/30",
};

export default function StudyPage() {
  const cardsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = flashCards.filter((card) => card.category === cat);
    return acc;
  }, {} as Record<string, typeof flashCards>);

  const cardsByDifficulty = {
    beginner: flashCards.filter((c) => c.difficulty === "beginner"),
    intermediate: flashCards.filter((c) => c.difficulty === "intermediate"),
    advanced: flashCards.filter((c) => c.difficulty === "advanced"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Study Tools</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Test your knowledge with interactive flashcards and track your progress
        </p>
      </div>

      {/* Study modes */}
      <section className="mb-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/study/flashcards"
          className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
            Flashcards
          </h2>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            Review concepts with spaced repetition flashcards
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">
              {flashCards.length} cards
            </span>
          </div>
        </Link>

        <Link
          href="/study/quiz"
          className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10">
            <Target className="h-6 w-6 text-chart-2" />
          </div>
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
            Quiz Mode
          </h2>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            Test yourself with timed multiple choice questions
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">
              Self-assessment
            </span>
          </div>
        </Link>

        <div className="group relative flex flex-col rounded-xl border border-border bg-card p-6 opacity-75">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
            <BarChart3 className="h-6 w-6 text-chart-3" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Progress Tracking
          </h2>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            Monitor your learning progress over time
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">
              Coming soon
            </span>
          </div>
        </div>
      </section>

      {/* By difficulty */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">By Difficulty</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(["beginner", "intermediate", "advanced"] as const).map((diff) => (
            <Link
              key={diff}
              href={`/study/flashcards?difficulty=${diff}`}
              className={`rounded-xl border p-5 transition-all hover:shadow-lg ${difficultyColors[diff]}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold capitalize">{diff}</h3>
                <span className="text-2xl font-bold">
                  {cardsByDifficulty[diff].length}
                </span>
              </div>
              <p className="mt-2 text-sm opacity-80">
                {diff === "beginner" && "Start here if you are new to STAPL"}
                {diff === "intermediate" && "Core concepts and patterns"}
                {diff === "advanced" && "Deep implementation details"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* By category */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">By Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/study/flashcards?category=${category}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                <span className="font-medium capitalize text-foreground">
                  {category}
                </span>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm text-muted-foreground">
                {cardsByCategory[category].length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick tips */}
      <section className="rounded-xl border border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
        <div className="flex items-start gap-4">
          <GraduationCap className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Study Tips</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Start with beginner cards to build a foundation
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Use the memory model visualizations alongside flashcards
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Review C++ mappings if you are familiar with STL
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Try to explain concepts aloud before flipping cards
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
