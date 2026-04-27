"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Card = {
  id: string;
  question: string;
  answer: string;
};

export default function PracticePage() {
  const params = useParams<{ id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/deck/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load deck");
        return res.json();
      })
      .then((data) => setCards(Array.isArray(data.cards) ? data.cards : []))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load deck");
      });
  }, [params?.id]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  if (cards.length === 0) return <p>Loading...</p>;

  const card = cards[index];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-96 h-60 border rounded flex items-center justify-center text-center p-4 cursor-pointer"
      >
        {flipped ? card.answer : card.question}
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((prev) => (prev + 1) % cards.length);
          }}
          className="border px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}