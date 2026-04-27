import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type DeckInsertPayload = {
  title: string;
  [key: string]: unknown;
};

export async function insertDeckForUser(clerkUserId: string, deck: DeckInsertPayload) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("decks")
    .insert({
      ...deck,
      user_id: clerkUserId,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(`Failed to insert deck: ${error.message}`);
  }

  return data;
}

export async function insertDeckForCurrentUser(deck: DeckInsertPayload) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to create a deck.");
  }

  return insertDeckForUser(userId, deck);
}
