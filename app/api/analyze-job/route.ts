import { NextResponse } from "next/server";
import { analyzeJob, AnalysisError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_CHARS = 30_000;
const MIN_JD_CHARS = 80;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { jobDescription, resumeText } = (body ?? {}) as {
    jobDescription?: unknown;
    resumeText?: unknown;
  };

  if (typeof jobDescription !== "string" || jobDescription.trim().length === 0) {
    return NextResponse.json(
      { error: "Paste a job description to analyze." },
      { status: 400 }
    );
  }

  if (jobDescription.trim().length < MIN_JD_CHARS) {
    return NextResponse.json(
      {
        error: `That job description is too short to analyze — paste at least ${MIN_JD_CHARS} characters.`,
      },
      { status: 400 }
    );
  }

  if (jobDescription.length > MAX_CHARS) {
    return NextResponse.json(
      { error: "That job description is too long. Trim it to 30,000 characters." },
      { status: 413 }
    );
  }

  const resume =
    typeof resumeText === "string" ? resumeText.slice(0, MAX_CHARS) : undefined;

  try {
    const result = await analyzeJob(jobDescription, resume);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AnalysisError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[analyze-job] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong analyzing that job description." },
      { status: 500 }
    );
  }
}
