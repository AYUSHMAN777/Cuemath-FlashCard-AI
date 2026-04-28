"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Deck = {
  id: string;
  title: string;
};

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  next_review?: string | null;
};

const difficultyStyles: Record<Flashcard["difficulty"], string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function DeckPage() {
  const params = useParams<{ id: string }>();
  const deckId = params?.id;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) return;

    const supabase = getSupabaseBrowserClient();
    let isMounted = true;

    const fetchDeckDetails = async () => {
      setLoading(true);
      setError(null);

      const [{ data: deckData, error: deckError }, { data: cardData, error: cardError }] = await Promise.all([
        supabase.from("decks").select("id, title").eq("id", deckId).single(),
        supabase
          .from("flashcards")
          .select("id, question, answer, difficulty, next_review")
          .eq("deck_id", deckId)
          .order("created_at", { ascending: true }),
      ]);

      if (!isMounted) return;

      if (deckError || !deckData) {
        setError("Deck not found.");
        setLoading(false);
        return;
      }

      if (cardError) {
        setError("Failed to load flashcards.");
        setLoading(false);
        return;
      }

      setDeck(deckData as Deck);
      setCards((cardData as Flashcard[]) ?? []);
      setLoading(false);
    };

    fetchDeckDetails();

    return () => {
      isMounted = false;
    };
  }, [deckId]);

  if (loading) {
    return <div className="mx-auto w-full max-w-4xl px-4 py-8 text-zinc-600 dark:text-zinc-300 sm:px-6 sm:py-10">Loading deck...</div>;
  }

  if (error || !deck) {
    return <div className="mx-auto w-full max-w-4xl px-4 py-8 text-rose-600 sm:px-6 sm:py-10">{error || "Deck not found."}</div>;
  }

  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-12rem] h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/18 via-sky-400/14 to-emerald-400/10 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <header className="rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <Button asChild variant="ghost" className="px-0">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 size-4" />
                  Dashboard
                </Link>
              </Button>

              <div className="min-w-0">
                <h1 className="break-words text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  {deck.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-2.5 py-0.5 text-xs dark:border-white/10 dark:bg-white/5">
                    {cards.length} cards
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Deck details & schedule</span>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="h-10 w-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-95 sm:w-auto"
            >
              <Link href={`/practice/${deck.id}`}>
                <Play className="mr-2 size-4" />
                Start Practice
              </Link>
            </Button>
          </div>
        </header>

      {cards.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-black/40 dark:text-zinc-300">
          <p className="text-base font-medium text-zinc-900 dark:text-white">No flashcards in this deck yet</p>
          <p className="mt-1">Try regenerating or uploading a different PDF.</p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href={`/practice/${deck.id}`}>Go to Practice</Link>
            </Button>
          </div>
        </div>
      ) : (
        <section className="space-y-4">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group relative rounded-3xl bg-gradient-to-r from-violet-500/16 via-sky-400/10 to-emerald-400/10 p-[1px]"
            >
              <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur transition-all group-hover:-translate-y-0.5 group-hover:shadow-md dark:border-white/10 dark:bg-black/40">
                <p className="break-words text-sm font-semibold text-zinc-900 dark:text-white sm:text-base">
                  {card.question}
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {card.answer}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyStyles[card.difficulty]}`}
                  >
                    {card.difficulty}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Next review: {card.next_review ? new Date(card.next_review).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
      </main>
    </div>
  );
}

