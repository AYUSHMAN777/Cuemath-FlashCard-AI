import { NextRequest, NextResponse } from "next/server";
import { insertDeckForCurrentUser } from "@/lib/supabase/decks";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Flashcard } from "@/lib/flashcards";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const title =
      typeof body === "object" && body !== null
        ? (body as { title?: unknown }).title
        : undefined;
    const flashcards =
      typeof body === "object" && body !== null
        ? (body as { flashcards?: unknown }).flashcards
        : undefined;

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return NextResponse.json({ error: "No flashcards" }, { status: 400 });
    }

    // 1. Create deck
    const deck = await insertDeckForCurrentUser({
      title: typeof title === "string" && title.trim() ? title.trim() : "My Deck",
    });

    const supabase = await getSupabaseServerClient();

    // 2. Insert flashcards
    const cardsToInsert = (flashcards as Flashcard[]).map((card) => ({
      deck_id: deck.id,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      next_review: new Date(),
    }));

    const { error } = await supabase.from("flashcards").insert(cardsToInsert);

    if (error) throw error;

    return NextResponse.json({ success: true, deckId: deck.id });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}