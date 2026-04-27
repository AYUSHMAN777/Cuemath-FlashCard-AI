"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/flashcards";

type ErrorResponse = { error?: string };

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [saving, setSaving] = useState(false);

  const handleUpload = async () => {
    if (loading) return;
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    setLoading(true);
    setFlashcards([]);

    try {
      // STEP 1: Upload PDF → Extract text
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      const extractedText = data.text;

      setText(extractedText);

      // STEP 2: Generate flashcards
      const res2 = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!res2.ok) {
        const err: ErrorResponse = await res2.json().catch(() => ({}));
        throw new Error(err.error || "Flashcard generation failed");
      }

      const data2: { flashcards?: Flashcard[] } = await res2.json();
      setFlashcards(Array.isArray(data2.flashcards) ? data2.flashcards : []);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (saving) return;
    if (flashcards.length === 0) return;

    setSaving(true);

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: file?.name || "My Deck",
          flashcards,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Deck saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save deck");
    }

    setSaving(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flashcard Generator</h1>

      {/* FILE INPUT */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Upload & Generate"}
      </button>

      {/* TEXT PREVIEW */}
      {text && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Extracted Preview</h2>
          <p className="text-sm text-gray-600">
            {text.slice(0, 300)}...
          </p>
        </div>
      )}

      {/* FLASHCARDS */}
      {flashcards.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-4">
            Generated Flashcards ({flashcards.length})
          </h2>

          <div className="space-y-4">
            {flashcards.map((card, index) => (
              <div key={index} className="border p-4 rounded">
                <p className="font-medium">{card.question}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {card.answer}
                </p>
                <span className="text-xs text-blue-500">
                  {card.difficulty}
                </span>
              </div>
            ))}
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 mt-6 rounded disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Deck"}
          </button>
        </div>
      )}
    </div>
  );
}