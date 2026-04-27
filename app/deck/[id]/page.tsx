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
          .select("id, question, answer, difficulty")
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
    return <div className="mx-auto w-full max-w-4xl px-6 py-10 text-zinc-600 dark:text-zinc-300">Loading deck...</div>;
  }

  if (error || !deck) {
    return <div className="mx-auto w-full max-w-4xl px-6 py-10 text-rose-600">{error || "Deck not found."}</div>;
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="px-0">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Dashboard
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">{deck.title}</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{cards.length} cards</p>
          </div>
        </div>

        <Button
          asChild
          className="h-10 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95"
        >
          <Link href={`/practice/${deck.id}`}>
            <Play className="mr-2 size-4" />
            Start Practice
          </Link>
        </Button>
      </header>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-sm text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-black/40 dark:text-zinc-300">
          No flashcards in this deck yet.
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
              className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-black/40"
            >
              <p className="font-semibold text-zinc-900 dark:text-white">{card.question}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{card.answer}</p>
              <span className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyStyles[card.difficulty]}`}>
                {card.difficulty}
              </span>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

