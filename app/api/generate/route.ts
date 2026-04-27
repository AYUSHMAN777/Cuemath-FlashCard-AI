import { NextRequest, NextResponse } from "next/server";
import { chunkText } from "@/lib/chunk";
import {
  Flashcard,
  generateFlashcards,
  ModelOverloadedError,
} from "@/lib/flashcards";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const text =
      typeof body === "object" && body !== null
        ? (body as { text?: unknown }).text
        : undefined;

    if (typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const chunks = chunkText(text);
    if (chunks.length === 0) {
      return NextResponse.json({ flashcards: [] });
    }

    let allFlashcards: Flashcard[] = [];

    for (const chunk of chunks) {
      const cards = await generateFlashcards(chunk);
      if (cards.length > 0) {
        allFlashcards = [...allFlashcards, ...cards];
      }
    }

    return NextResponse.json({
      flashcards: allFlashcards,
    });
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof ModelOverloadedError) {
      return NextResponse.json(
        {
          error:
            "Gemini is overloaded right now (503). Please wait 10–30 seconds and try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}