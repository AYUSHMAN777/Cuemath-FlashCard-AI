"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FileUp, RefreshCcw, Sparkles, UploadCloud } from "lucide-react";
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
  const [regenerating, setRegenerating] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [sourceText, setSourceText] = useState("");
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generateFlashcards = async (text: string) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as ApiError | null;
      throw new Error(err?.error || "Failed to generate flashcards");
    }

    const data = (await res.json()) as GenerateResponse;
    const nextCards = Array.isArray(data.flashcards) ? data.flashcards : [];
    setCards(nextCards);
    setOpenCardIndex(null);
    setIsExpanded(false);
  };

  const handleUpload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setCards([]);
    setOpenCardIndex(null);
    setIsExpanded(false);
    setErrorMessage("");

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
      setSourceText(text);

      // Step 2: generate flashcards
      await generateFlashcards(text);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(
        message === "No text extracted from PDF"
          ? "We could not extract readable text from this PDF. Please try a different PDF with selectable text."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!sourceText || regenerating) return;

    setRegenerating(true);
    setErrorMessage("");
    try {
      await generateFlashcards(sourceText);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to regenerate flashcards");
    } finally {
      setRegenerating(false);
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10rem] h-[24rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-sky-400/15 to-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[22rem] w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-400/10 via-violet-400/10 to-sky-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-zinc-300">
            <Sparkles className="size-3.5 text-violet-600 dark:text-violet-400" />
            AI-powered flashcard generation
          </div>
          <h1 className="mt-5 bg-gradient-to-r from-zinc-900 via-violet-700 to-sky-600 bg-clip-text text-4xl font-semibold tracking-tight text-transparent dark:from-white dark:via-violet-200 dark:to-sky-300">
            Upload your PDF
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Generate quality flashcards instantly, then save and practice right away.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Upload source</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Choose a PDF and generate a clean flashcard set from it.
            </p>
          </div>

          <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-8 text-center transition hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-violet-500 dark:hover:bg-zinc-900 sm:p-10">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <UploadCloud className="mx-auto size-9 text-zinc-500 transition group-hover:text-violet-600 dark:text-zinc-400 dark:group-hover:text-violet-400" />
            <p className="mt-3 break-all text-sm font-medium text-zinc-900 dark:text-white sm:text-base">
              {file ? file.name : "Click to upload your PDF"}
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Max 5MB • PDF only</p>
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleUpload}
              disabled={!file || loading || regenerating}
              className="h-10 w-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95 sm:w-auto"
            >
              <FileUp className="mr-2 size-4" />
              {loading ? "Generating..." : "Generate Flashcards"}
            </Button>
            {cards.length > 0 ? (
              <Button
                onClick={handleRegenerate}
                disabled={loading || regenerating || !sourceText}
                variant="outline"
                className="h-10 w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 size-4" />
                {regenerating ? "Regenerating..." : "Regenerate"}
              </Button>
            ) : null}
            {cards.length > 0 ? (
              <Button onClick={handleSaveDeck} disabled={saving} variant="outline" className="h-10 w-full sm:w-auto">
                {saving ? "Saving..." : "Save Deck"}
              </Button>
            ) : null}
          </div>

          {loading || regenerating ? (
            <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/80 p-4 text-sm text-violet-800 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-200">
              <p className="font-medium">{loading ? "Generating flashcards..." : "Regenerating flashcards..."}</p>
              <p className="mt-1 text-violet-700 dark:text-violet-300">
                This can take a few minutes depending on the PDF size and AI response time. Please keep this page open.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Large PDFs can take a few minutes to process and generate into flashcards.
            </p>
          )}

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
              {errorMessage}
            </div>
          ) : null}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-white">Flashcard Preview</h2>
            {cards.length > 0 ? (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{cards.length} generated</span>
            ) : null}
          </div>

          {cards.length > 0 ? (
            <>
              <div className="space-y-3">
                {(isExpanded ? cards : cards.slice(0, 2)).map((c, i) => {
                  const isOpen = openCardIndex === i;

                  return (
                    <div
                      key={`${c.question}-${i}`}
                      className="group rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60"
                    >
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-3 text-left"
                        onClick={() => setOpenCardIndex(isOpen ? null : i)}
                        aria-expanded={isOpen}
                      >
                        <div className="min-w-0">
                          <p className="font-medium leading-6 text-zinc-900 dark:text-white">{c.question}</p>
                          <span className="mt-2 inline-flex rounded-full bg-gradient-to-r from-violet-100 to-sky-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:from-violet-950/50 dark:to-sky-950/50 dark:text-violet-200">
                            {c.difficulty}
                          </span>
                        </div>
                        <span className="mt-0.5 rounded-full border border-black/10 bg-zinc-50 p-1.5 text-zinc-700 shadow-sm transition group-hover:border-violet-200 group-hover:text-violet-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-violet-200">
                          <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>

                      <div
                        className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-3 border-t border-violet-100 pt-3 text-sm leading-6 text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                            {c.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cards.length > 2 ? (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded((prev) => !prev);
                      setOpenCardIndex(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    <span>{isExpanded ? "Show Less" : `View all ${cards.length} flashcards`}</span>
                    <ChevronDown className={`size-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-200">Flashcard preview will appear here</p>
                <p className="mt-1">Upload a PDF and click generate to inspect the cards before saving.</p>
              </div>
            </div>
          )}

          {cards.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-3 text-sm text-violet-700 dark:border-violet-900/30 dark:bg-violet-950/40 dark:text-violet-300">
              Tap the arrow to expand a flashcard. If the set is not good enough, use regenerate before saving.
            </div>
          ) : null}
        </div>
        </div>

        {cards.length > 0 ? (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveDeck}
              disabled={saving}
              className="h-10 w-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-95 sm:w-auto"
            >
              {saving ? "Saving..." : "Save Deck & Open"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}