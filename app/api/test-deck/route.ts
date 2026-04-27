import { NextResponse } from "next/server";

import { insertDeckForCurrentUser } from "@/lib/supabase/decks";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      [key: string]: unknown;
    };

    const deck = await insertDeckForCurrentUser({
      title: body.title ?? `Test Deck ${new Date().toISOString()}`,
      ...body,
    });

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
