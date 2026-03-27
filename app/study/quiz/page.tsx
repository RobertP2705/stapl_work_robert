"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { flashCards } from "@/lib/stapl-data";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  category: string;
}

function generateQuizQuestions(count: number): QuizQuestion[] {
  const shuffled = [...flashCards].sort(() => Math.random() - 0.5).slice(0, count);
  
  return shuffled.map((card) => {
    // Get wrong answers from other cards
    const otherAnswers = flashCards
      .filter((c) => c.id !== card.id)
      .map((c) => c.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [card.answer, ...otherAnswers].sort(() => Math.random() - 0.5);

    return {
      id: card.id,
      question: card.question,
      correctAnswer: card.answer,
      options,
      category: card.category,
    };
  });
}

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; question: string }[]>([]);

  const QUIZ_LENGTH = 5;

  const startQuiz = () => {
    setQuestions(generateQuizQuestions(QUIZ_LENGTH));
    setQuizStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(30);
    setQuizComplete(false);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Timer
  useEffect(() => {
    if (!quizStarted || showResult || quizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResult, quizComplete, currentIndex]);

  const handleAnswer = (answer: string | null) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      { correct: isCorrect, question: questions[currentIndex].question },
    ]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const currentQuestion = questions[currentIndex];

  if (!quizStarted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/study"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Study
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">STAPL Quiz</h1>
          <p className="mt-2 text-muted-foreground">
            Test your knowledge with {QUIZ_LENGTH} multiple choice questions
          </p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">30 seconds per question</p>
                <p className="text-xs text-muted-foreground">Answer before time runs out</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-chart-2" />
              <div>
                <p className="text-sm font-medium text-foreground">Immediate feedback</p>
                <p className="text-xs text-muted-foreground">See if you got it right instantly</p>
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="mt-8 w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              percentage >= 80
                ? "bg-chart-2/10"
                : percentage >= 60
                ? "bg-chart-3/10"
                : "bg-chart-5/10"
            }`}
          >
            <span
              className={`text-3xl font-bold ${
                percentage >= 80
                  ? "text-chart-2"
                  : percentage >= 60
                  ? "text-chart-3"
                  : "text-chart-5"
              }`}
            >
              {percentage}%
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Quiz Complete</h2>
          <p className="mt-2 text-muted-foreground">
            You scored {score} out of {questions.length}
          </p>

          <div className="mt-6 space-y-2">
            {answers.map((answer, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg p-3 text-left ${
                  answer.correct ? "bg-chart-2/10" : "bg-chart-5/10"
                }`}
              >
                {answer.correct ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-chart-5" />
                )}
                <span className="text-sm text-foreground">{answer.question}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={startQuiz}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/study"
              className="flex flex-1 items-center justify-center rounded-lg border border-border bg-card py-3 font-medium text-foreground transition-colors hover:bg-accent"
            >
              Back to Study
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 ${
            timeLeft <= 10 ? "bg-chart-5/10 text-chart-5" : "bg-muted text-muted-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span className="font-mono font-medium">{timeLeft}s</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Timer bar */}
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full ${timeLeft <= 10 ? "bg-chart-5" : "bg-chart-2"}`}
          animate={{ width: `${(timeLeft / 30) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <span className="mb-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
          {currentQuestion.category}
        </span>
        <h2 className="text-lg font-medium text-foreground">{currentQuestion.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <motion.button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                showCorrect
                  ? "border-chart-2 bg-chart-2/10"
                  : showWrong
                  ? "border-chart-5 bg-chart-5/10"
                  : isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    showCorrect
                      ? "bg-chart-2 text-white"
                      : showWrong
                      ? "bg-chart-5 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className={`text-sm leading-relaxed ${
                    showCorrect
                      ? "text-chart-2"
                      : showWrong
                      ? "text-chart-5"
                      : "text-foreground"
                  }`}
                >
                  {option}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Score */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Current score: {score}/{currentIndex + (showResult ? 1 : 0)}
      </div>
    </div>
  );
}
