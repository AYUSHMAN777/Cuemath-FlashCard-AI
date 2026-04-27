import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(buffer: Buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();

    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract PDF text");
  } finally {
    await parser.destroy();
  }
}