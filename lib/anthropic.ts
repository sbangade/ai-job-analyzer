import Anthropic from "@anthropic-ai/sdk";
import { ANALYSIS_TOOL, SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import type { AnalysisResult } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-5";

/** Thrown for anything we want to surface to the user verbatim. */
export class AnalysisError extends Error {
  constructor(
    message: string,
    readonly status: number = 500
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

let cached: Anthropic | null = null;

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AnalysisError(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.",
      500
    );
  }
  if (!cached) cached = new Anthropic({ apiKey });
  return cached;
}

/**
 * The model fills in every field, but it is still a language model — clamp and
 * default anything that could come back malformed before it reaches the UI.
 */
function normalize(raw: unknown, hasResume: boolean): AnalysisResult {
  const r = (raw ?? {}) as Record<string, unknown>;
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const role = (r.role ?? {}) as Record<string, unknown>;

  const rawScore = typeof r.matchScore === "number" ? r.matchScore : 0;
  const matchScore = hasResume
    ? Math.max(0, Math.min(100, Math.round(rawScore)))
    : null;

  return {
    role: {
      title: String(role.title ?? "Untitled role"),
      seniority: String(role.seniority ?? "Not specified"),
      yearsExperience: String(role.yearsExperience ?? "Not specified"),
      primaryStack: arr<string>(role.primaryStack),
    },
    matchScore,
    matchSummary: String(r.matchSummary ?? ""),
    employerPriorities: String(r.employerPriorities ?? ""),
    requiredSkills: arr(r.requiredSkills),
    missingSkills: hasResume ? arr(r.missingSkills) : [],
    keyResponsibilities: arr<string>(r.keyResponsibilities),
    interviewQuestions: arr(r.interviewQuestions),
    resumeFeedback: hasResume ? arr(r.resumeFeedback) : [],
    redFlags: arr<string>(r.redFlags),
    hasResume,
  };
}

export async function analyzeJob(
  jobDescription: string,
  resumeText?: string
): Promise<AnalysisResult> {
  const hasResume = Boolean(resumeText && resumeText.trim().length > 0);
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  let message: Anthropic.Message;
  try {
    message = await client().messages.create({
      model,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: [ANALYSIS_TOOL],
      // Force the model to answer through the tool, so we always get valid JSON.
      tool_choice: { type: "tool", name: ANALYSIS_TOOL.name },
      messages: [
        { role: "user", content: buildUserPrompt(jobDescription, resumeText) },
      ],
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      if (err.status === 401) {
        throw new AnalysisError(
          "Anthropic rejected the API key. Check ANTHROPIC_API_KEY in .env.local.",
          401
        );
      }
      if (err.status === 404) {
        throw new AnalysisError(
          `The model "${model}" is not available on this account. Set ANTHROPIC_MODEL in .env.local to one you have access to.`,
          400
        );
      }
      if (err.status === 429) {
        throw new AnalysisError(
          "Rate limited by Anthropic. Wait a moment and try again.",
          429
        );
      }
      throw new AnalysisError(`Anthropic API error: ${err.message}`, 502);
    }
    throw err;
  }

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new AnalysisError(
      "The model did not return a structured analysis. Try again, or shorten the job description.",
      502
    );
  }

  return normalize(toolUse.input, hasResume);
}
