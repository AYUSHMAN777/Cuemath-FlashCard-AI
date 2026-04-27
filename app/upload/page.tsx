"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flashcard } from "@/lib/flashcards";

type ApiError = { error?: string };
type UploadResponse = { text?: string };
type GenerateResponse = { flashcards?: Flashcard[] };
type SaveResponse = { deckId?: string };

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);

  const handleUpload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setCards([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Step 1: extract text
      const res1 = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res1.ok) {
        const err = (await res1.json().catch(() => null)) as ApiError | null;
        throw new Error(err?.error || "Failed to upload PDF");
      }

      const { text } = (await res1.json()) as UploadResponse;
      if (!text) {
        throw new Error("No text extracted from PDF");
      }

      // Step 2: generate flashcards
      const res2 = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res2.ok) {
        const err = (await res2.json().catch(() => null)) as ApiError | null;
        throw new Error(err?.error || "Failed to generate flashcards");
      }

      const data = (await res2.json()) as GenerateResponse;
      setCards(Array.isArray(data.flashcards) ? data.flashcards : []);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDeck = async () => {
    if (!file || cards.length === 0 || saving) return;

    setSaving(true);
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name.replace(/\.pdf$/i, ""),
          flashcards: cards,
        }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as ApiError | null;
        throw new Error(err?.error || "Failed to save deck");
      }

      const data = (await res.json()) as SaveResponse;
      if (!data.deckId) throw new Error("Deck saved but no deck id returned");

      router.push(`/deck/${data.deckId}`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to save deck");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-zinc-300">
          <Sparkles className="size-3.5 text-violet-600 dark:text-violet-400" />
          AI-powered flashcard generation
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Upload your PDF
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Generate quality flashcards instantly, then save and practice right away.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
          <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-10 text-center transition hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-violet-500 dark:hover:bg-zinc-900">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <UploadCloud className="mx-auto size-9 text-zinc-500 transition group-hover:text-violet-600 dark:text-zinc-400 dark:group-hover:text-violet-400" />
            <p className="mt-3 font-medium text-zinc-900 dark:text-white">
              {file ? file.name : "Click to upload your PDF"}
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Max 5MB • PDF only</p>
          </label>

          <div className="mt-5 flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="h-10 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95"
            >
              <FileUp className="mr-2 size-4" />
              {loading ? "Generating..." : "Generate Flashcards"}
            </Button>
            {cards.length > 0 ? (
              <Button onClick={handleSaveDeck} disabled={saving} variant="outline" className="h-10">
                {saving ? "Saving..." : "Save Deck"}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-white">Flashcard Preview</h2>
            {cards.length > 0 ? (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{cards.length} generated</span>
            ) : null}
          </div>

          {cards.length > 0 ? (
            <div className="space-y-3">
              {cards.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/60"
                >
                  <p className="font-medium text-zinc-900 dark:text-white">{c.question}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{c.answer}</p>
                  <span className="mt-2 inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {c.difficulty}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-zinc-300 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Upload a PDF and click generate to preview flashcards here.
            </div>
          )}

          {cards.length > 0 ? (
            <div className="mt-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              Save deck to continue: you will be redirected to the deck page after save.
            </div>
          ) : null}
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveDeck}
            disabled={saving}
            className="h-10 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95"
          >
            {saving ? "Saving..." : "Save Deck & Open"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}