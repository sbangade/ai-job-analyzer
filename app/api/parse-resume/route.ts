import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

async function extractPdf(buffer: Buffer): Promise<string> {
  // unpdf bundles a serverless-safe build of pdf.js — no native canvas dependency.
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n") : text;
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const { value } = await mammoth.extractRawText({ buffer });
  return value ?? "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the uploaded file." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That file is larger than 5 MB." },
      { status: 413 }
    );
  }

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text: string;

    if (name.endsWith(".pdf")) {
      text = await extractPdf(buffer);
    } else if (name.endsWith(".docx")) {
      text = await extractDocx(buffer);
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buffer.toString("utf8");
    } else {
      return NextResponse.json(
        { error: "Upload a PDF, DOCX, TXT or MD file — or paste your resume instead." },
        { status: 415 }
      );
    }

    // Collapse the ragged whitespace PDF extraction leaves behind.
    text = text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

    if (text.length < 100) {
      return NextResponse.json(
        {
          error:
            "Almost no text came out of that file — it may be a scanned image. Paste your resume as text instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text, filename: file.name });
  } catch (err) {
    console.error("[parse-resume] extraction failed:", err);
    return NextResponse.json(
      { error: "Could not read that file. Try pasting your resume as text." },
      { status: 500 }
    );
  }
}
