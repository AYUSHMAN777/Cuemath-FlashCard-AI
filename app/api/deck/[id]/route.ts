import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  // Ensure deck belongs to current user.
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  const { data: cards, error } = await supabase
    .from("flashcards")
    .select("id, question, answer, difficulty")
    .eq("deck_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }

  return NextResponse.json({ cards: cards ?? [] });
}