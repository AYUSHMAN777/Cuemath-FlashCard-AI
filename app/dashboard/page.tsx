import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { getSupabaseServerClient } from "@/lib/supabase/server";

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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Decks</h1>

      {decks && decks.length > 0 ? (
        decks.map((deck) => (
          <Link key={deck.id} href={`/practice/${deck.id}`}>
            <div className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
              {deck.title}
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-gray-500">No decks yet.</p>
      )}
    </div>
  );
}