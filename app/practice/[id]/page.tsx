"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import FlipFlashcard from "@/components/flashcards/flipanimation";
import { ProgressBar } from "@/components/flashcards/ProgressBar";
import { RatingButtons, type FlashcardRating } from "@/components/flashcards/RatingButton";
import { calculateSpacedRepetition, mapRatingToQuality } from "@/lib/spacedRepetition";
import { Button } from "@/components/ui/button";

type Card = {
  id: string;
  question: string;
  answer: string;
  repetitions?: number;
  interval?: number;
  ease_factor?: number;
};

const LAST_STUDY_KEY = "flashcard-ai:last-study-date";
const STREAK_KEY = "flashcard-ai:study-streak";

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dayDiff(from: string, to: string) {
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T00:00:00.000Z`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
}

function markStreakForToday() {
  const today = toDateKey(new Date());
  const prevDate = localStorage.getItem(LAST_STUDY_KEY);
  const prevStreak = Number(localStorage.getItem(STREAK_KEY) ?? "0");

  if (prevDate === today) return prevStreak;

  const diff = prevDate ? dayDiff(prevDate, today) : Number.POSITIVE_INFINITY;
  const nextStreak = diff === 1 ? prevStreak + 1 : 1;

  localStorage.setItem(LAST_STUDY_KEY, today);
  localStorage.setItem(STREAK_KEY, String(nextStreak));
  return nextStreak;
}

export default function PracticePage() {
  const params = useParams<{ id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [nextReviewMessage, setNextReviewMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streakValue, setStreakValue] = useState<number | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/deck/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load deck");
        return res.json();
      })
      .then((data) => {
        const loaded = Array.isArray(data.cards) ? data.cards : [];
        setCards(loaded);
        setIndex(0);
        setFlipped(false);
        setNextReviewMessage("");
        setCompleted(false);
        setShowCelebration(false);
        setStreakValue(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load deck");
      });
  }, [params?.id]);

  const currentCard = cards[index] ?? null;
  const current = index + 1;
  const total = cards.length;

  const goNext = useCallback(() => {
    if (cards.length === 0) return;
    setTransitioning(true);
    setFlipped(false);
    setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, cards.length - 1));
      setTransitioning(false);
    }, 220);
  }, [cards.length]);

  const handleRate = useCallback(
    async (rating: FlashcardRating) => {
      if (loading || !currentCard) return;
      if (!flipped) return;

      setLoading(true);
      setError("");
      try {
        const quality = mapRatingToQuality(rating);
        const prediction = calculateSpacedRepetition(
          {
            repetitions: currentCard.repetitions ?? 0,
            interval: currentCard.interval ?? 1,
            ease_factor: currentCard.ease_factor ?? 2.5,
          },
          quality
        );
        setNextReviewMessage(`Next review in ${prediction.interval} day${prediction.interval === 1 ? "" : "s"}`);

        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId: currentCard.id, rating }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || "Failed to save review");
        }

        const isLastCard = index >= cards.length - 1;
        if (isLastCard) {
          const nextStreak = markStreakForToday();
          setStreakValue(nextStreak);
          setCompleted(true);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 1000);
        } else {
          setTimeout(() => {
            goNext();
          }, 260);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to save review");
      } finally {
        setLoading(false);
      }
    },
    [cards.length, currentCard, flipped, goNext, index, loading]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (loading || !currentCard) return;
      if (completed) return;
      if (!flipped) return;

      if (e.key === "1") handleRate("again");
      if (e.key === "2") handleRate("hard");
      if (e.key === "3") handleRate("good");
      if (e.key === "4") handleRate("easy");
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [completed, currentCard, flipped, handleRate, loading]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  if (cards.length === 0 || !currentCard) return <p className="p-8 text-center">Loading practice...</p>;

  if (completed) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-sky-400/15 to-violet-400/15 blur-3xl" />
        </div>

        <AnimatePresence>
          {showCelebration ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -10 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
            >
              <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 px-8 py-6 text-center text-white shadow-2xl">
                <div className="text-4xl">🔥</div>
                <div className="mt-2 text-xl font-semibold">Streak +1!</div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mx-auto flex min-h-[75vh] w-full max-w-2xl flex-col items-center justify-center">
          <div className="w-full rounded-3xl border border-black/10 bg-white/80 p-6 text-center shadow-sm dark:border-white/10 dark:bg-black/40 sm:p-10">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">Deck complete 🎉</h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">You finished all flashcards in this deck.</p>
            {streakValue !== null ? (
              <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Current streak: {streakValue} day{streakValue === 1 ? "" : "s"}
              </p>
            ) : null}
            <div className="mt-8">
              <Button
                asChild
                className="h-10 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95"
              >
                <Link href="/dashboard">Return to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-sky-400/15 to-emerald-400/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col justify-center">
        <ProgressBar current={current} total={total} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <FlipFlashcard
              question={currentCard.question}
              answer={currentCard.answer}
              flipped={flipped}
              onToggle={() => setFlipped((v) => !v)}
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setFlipped((v) => !v)}
            className="rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm transition hover:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-black/40 dark:text-zinc-300 dark:hover:bg-black/50"
            disabled={loading || transitioning}
          >
            {flipped ? "Show Question" : "Show Answer"}
          </button>

          <button
            onClick={goNext}
            className="rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm transition hover:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-black/40 dark:text-zinc-300 dark:hover:bg-black/50"
            disabled={loading || transitioning || index >= cards.length - 1}
          >
            Next
          </button>
        </div>

        <RatingButtons onRate={handleRate} disabled={!flipped || loading || transitioning} />

        <AnimatePresence>
          {nextReviewMessage ? (
            <motion.p
              key={nextReviewMessage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              {nextReviewMessage}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <p className="mt-4 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Click the card to flip, then rate it with your keyboard.
          <span className="block">
            1=Again 😵, 2=Hard 🤔, 3=Good 🙂, 4=Easy 😎
          </span>
        </p>
      </div>
    </div>
  );
}