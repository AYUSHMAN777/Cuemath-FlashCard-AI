import { GoogleGenerativeAI } from "@google/generative-ai";

export type GeminiModelName = string;

export function getGeminiModel(modelName?: GeminiModelName) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const resolvedModel =
    modelName ||
    process.env.GEMINI_MODEL ||
    // default
    "gemini-2.5-flash";

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: resolvedModel,
  });
}