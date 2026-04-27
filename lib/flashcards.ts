import { getGeminiModel } from "@/lib/gemini";

export type Flashcard = {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
};

export class ModelOverloadedError extends Error {
  status = 503 as const;
  constructor(message = "Model is overloaded. Please try again.") {
    super(message);
    this.name = "ModelOverloadedError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getHttpStatusFromUnknownError(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const maybe = error as { status?: unknown; code?: unknown };
  if (typeof maybe.status === "number") return maybe.status;
  if (typeof maybe.code === "number") return maybe.code;
  return undefined;
}

export function buildFlashcardPrompt(content: string) {
  return `
You are an expert teacher.

Convert the following content into high-quality flashcards.

Rules:
- Cover important concepts
- Include definitions and examples
- Avoid trivial questions
- Keep answers concise

Return STRICT JSON:
[
  {
    "question": "...",
    "answer": "...",
    "difficulty": "easy | medium | hard"
  }
]

Content:
${content}
`;
}

function isFlashcard(value: unknown): value is Flashcard {
  if (typeof value !== "object" || value === null) return false;

  const card = value as Record<string, unknown>;
  return (
    typeof card.question === "string" &&
    card.question.trim().length > 0 &&
    typeof card.answer === "string" &&
    card.answer.trim().length > 0 &&
    (card.difficulty === "easy" ||
      card.difficulty === "medium" ||
      card.difficulty === "hard")
  );
}

export async function generateFlashcards(chunk: string): Promise<Flashcard[]> {
  const prompt = buildFlashcardPrompt(chunk);
  const primaryModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbackModelName =
    process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite";

  const attemptModel = async (modelName: string) => {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const maxAttemptsPerModel = 3;
  const baseDelayMs = 800;

  const runWithRetries = async (modelName: string) => {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttemptsPerModel; attempt++) {
      try {
        return await attemptModel(modelName);
      } catch (err) {
        lastError = err;
        const status = getHttpStatusFromUnknownError(err);
        const retryable = status === 503 || status === 429;
        if (!retryable) break;

        const delay = baseDelayMs * 2 ** attempt;
        await sleep(delay);
      }
    }

    throw lastError;
  };

  let text: string;
  try {
    text = await runWithRetries(primaryModelName);
  } catch (err) {
    const status = getHttpStatusFromUnknownError(err);
    if (status === 503 || status === 429) {
      try {
        text = await runWithRetries(fallbackModelName);
      } catch {
        throw new ModelOverloadedError();
      }
    } else {
      throw err;
    }
  }

  try {
    // Clean Gemini output
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed: unknown = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFlashcard);
  } catch {
    console.error("JSON parse failed:", text);
    return [];
  }
}