"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { flashCards, type FlashCard } from "@/lib/stapl-data";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Shuffle,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const difficultyFilter = searchParams.get("difficulty");

  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());

  // Filter and initialize cards
  useEffect(() => {
    let filtered = [...flashCards];
    
    if (categoryFilter) {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }
    if (difficultyFilter) {
      filtered = filtered.filter((c) => c.difficulty === difficultyFilter);
    }

    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  }, [categoryFilter, difficultyFilter]);

  const currentCard = cards[currentIndex];

  const nextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  const markKnown = () => {
    if (currentCard) {
      setKnownCards((prev) => new Set([...prev, currentCard.id]));
      setUnknownCards((prev) => {
        const next = new Set(prev);
        next.delete(currentCard.id);
        return next;
      });
      nextCard();
    }
  };

  const markUnknown = () => {
    if (currentCard) {
      setUnknownCards((prev) => new Set([...prev, currentCard.id]));
      setKnownCards((prev) => {
        const next = new Set(prev);
        next.delete(currentCard.id);
        return next;
      });
      nextCard();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextCard();
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
      if (e.key === "k") markKnown();
      if (e.key === "u") markUnknown();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard, markKnown, markUnknown]);

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">No flashcards match your filters</p>
          <Link href="/study" className="mt-4 inline-block text-primary hover:underline">
            Back to Study Tools
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const knownCount = knownCards.size;
  const unknownCount = unknownCards.size;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/study"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Study
        </Link>
        <div className="flex items-center gap-2">
          {categoryFilter && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
              {categoryFilter}
            </span>
          )}
          {difficultyFilter && (
            <span className="rounded-full bg-chart-3/10 px-3 py-1 text-xs font-medium capitalize text-chart-3">
              {difficultyFilter}
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-chart-2">
              <Check className="h-3 w-3" />
              {knownCount}
            </span>
            <span className="flex items-center gap-1 text-chart-5">
              <X className="h-3 w-3" />
              {unknownCount}
            </span>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="perspective-1000 mb-6 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${isFlipped}`}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`min-h-[300px] rounded-2xl border-2 p-8 ${
              isFlipped
                ? "border-chart-2/50 bg-chart-2/5"
                : "border-border bg-card"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  currentCard.difficulty === "beginner"
                    ? "bg-chart-2/10 text-chart-2"
                    : currentCard.difficulty === "intermediate"
                    ? "bg-chart-3/10 text-chart-3"
                    : "bg-chart-5/10 text-chart-5"
                }`}
              >
                {currentCard.difficulty}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {currentCard.category}
              </span>
            </div>

            <div className="flex min-h-[180px] items-center justify-center">
              <p
                className={`text-center text-lg leading-relaxed ${
                  isFlipped ? "text-chart-2" : "text-foreground"
                }`}
              >
                {isFlipped ? currentCard.answer : currentCard.question}
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              {isFlipped ? "Answer" : "Click to reveal answer"}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          onClick={markUnknown}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-chart-5/50 bg-chart-5/10 text-chart-5 transition-all hover:bg-chart-5/20"
          title="Mark as unknown (U)"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary transition-all hover:bg-primary/20"
          title="Flip card (Space)"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
        <button
          onClick={markKnown}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-chart-2/50 bg-chart-2/10 text-chart-2 transition-all hover:bg-chart-2/20"
          title="Mark as known (K)"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={shuffleCards}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Shuffle deck"
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button
            onClick={resetDeck}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Reset deck"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={nextCard}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Keyboard shortcuts
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">Space</kbd> Flip
          </span>
          <span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">←</kbd>{" "}
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">→</kbd> Navigate
          </span>
          <span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">K</kbd> Known
          </span>
          <span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">U</kbd> Unknown
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading flashcards...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}
