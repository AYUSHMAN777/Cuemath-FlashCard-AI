import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 🔒 File size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await extractTextFromPDF(buffer);

    return NextResponse.json({
      success: true,
      text: text.slice(0, 5000), // limit output
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    ); 
  }
}