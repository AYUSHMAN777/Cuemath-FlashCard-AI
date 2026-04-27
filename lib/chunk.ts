export function chunkText(text: string, chunkSize = 1500, overlap = 200) {
  const normalized = text.trim();
  if (!normalized) return [];

  const words = normalized.split(/\s+/);
  const chunks: string[] = [];
  const safeOverlap = Math.min(Math.max(overlap, 0), chunkSize - 1);
  const step = chunkSize - safeOverlap;

  let i = 0;

  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk) chunks.push(chunk);
    i += step;
  }

  return chunks.slice(0, 3); // limit to 3 chunks (free tier safe)
}