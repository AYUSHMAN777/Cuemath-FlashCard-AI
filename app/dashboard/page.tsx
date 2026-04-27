import { auth } from "@clerk/nextjs/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardClient, type DashboardDeck, type DashboardStats } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div className="p-6">Please sign in to view your decks.</div>;
  }

  const supabase = await getSupabaseServerClient();
  const { data: decks, error } = await supabase
    .from("decks")
    .select("id, title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6">Failed to load decks.</div>;
  }

  const safeDecks: DashboardDeck[] = (decks ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    totalCards: 0,
    dueCards: 0,
  }));
  const deckIds = safeDecks.map((d) => d.id);

  const todayISO = new Date().toISOString().slice(0, 10);
  const endOfTodayISO = `${todayISO}T23:59:59.999Z`;

  const [{ count: totalCards }, { count: dueToday }, { data: cardRows }] = await Promise.all([
    deckIds.length
      ? supabase
          .from("flashcards")
          .select("id", { count: "exact", head: true })
          .in("deck_id", deckIds)
      : Promise.resolve({ count: 0 }),
    deckIds.length
      ? supabase
          .from("flashcards")
          .select("id", { count: "exact", head: true })
          .in("deck_id", deckIds)
          .lte("next_review", endOfTodayISO)
      : Promise.resolve({ count: 0 }),
    deckIds.length
      ? supabase
          .from("flashcards")
          .select("deck_id, next_review")
          .in("deck_id", deckIds)
      : Promise.resolve({ data: [] }),
  ]);

  const metrics = new Map<string, { totalCards: number; dueCards: number }>();
  for (const deck of safeDecks) {
    metrics.set(deck.id, { totalCards: 0, dueCards: 0 });
  }

  for (const card of cardRows ?? []) {
    const entry = metrics.get(card.deck_id);
    if (!entry) continue;
    entry.totalCards += 1;
    if (card.next_review && card.next_review <= endOfTodayISO) {
      entry.dueCards += 1;
    }
  }

  const enrichedDecks: DashboardDeck[] = safeDecks.map((deck) => {
    const meta = metrics.get(deck.id);
    return {
      ...deck,
      totalCards: meta?.totalCards ?? 0,
      dueCards: meta?.dueCards ?? 0,
    };
  });

  const stats: DashboardStats = {
    totalDecks: enrichedDecks.length,
    totalCards: totalCards ?? 0,
    dueToday: dueToday ?? 0,
  };

  return <DashboardClient stats={stats} decks={enrichedDecks} />;
}