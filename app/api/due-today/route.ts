import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getSupabaseServerClient();

  const { data: decks, error: decksError } = await supabase
    .from("decks")
    .select("id")
    .eq("user_id", userId);

  if (decksError) {
    return NextResponse.json({ error: "Failed to load decks" }, { status: 500 });
  }

  const deckIds = (decks ?? []).map((deck) => deck.id);
  if (deckIds.length === 0) {
    return NextResponse.json({ dueCount: 0 });
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const endOfTodayISO = `${todayISO}T23:59:59.999Z`;

  const { count, error: dueError } = await supabase
    .from("flashcards")
    .select("id", { count: "exact", head: true })
    .in("deck_id", deckIds)
    .lte("next_review", endOfTodayISO);

  if (dueError) {
    return NextResponse.json({ error: "Failed to load due cards" }, { status: 500 });
  }

  return NextResponse.json({ dueCount: count ?? 0 });
}
