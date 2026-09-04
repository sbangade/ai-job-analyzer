import type Anthropic from "@anthropic-ai/sdk";

/**
 * We force structured output by handing Claude a single tool and requiring it.
 * This is far more reliable than asking for "JSON only" in the prompt — the API
 * validates the shape against this schema before it comes back to us.
 */
export const ANALYSIS_TOOL: Anthropic.Tool = {
  name: "submit_job_analysis",
  description:
    "Submit the structured analysis of a job description (and optionally a candidate resume).",
  input_schema: {
    type: "object",
    properties: {
      role: {
        type: "object",
        properties: {
          title: { type: "string", description: "Normalized job title." },
          seniority: {
            type: "string",
            description: "Junior, Mid-level, Senior, Staff, or Lead.",
          },
          yearsExperience: {
            type: "string",
            description: "Years of experience asked for, e.g. '3-5 years'.",
          },
          primaryStack: {
            type: "array",
            items: { type: "string" },
            description: "The 3-6 technologies most central to the role.",
          },
        },
        required: ["title", "seniority", "yearsExperience", "primaryStack"],
      },
      matchScore: {
        type: "integer",
        description:
          "0-100 fit between the resume and the job. Weight must-have skills roughly 3x nice-to-haves, and factor in seniority fit. Use 0 when no resume was provided.",
      },
      matchSummary: {
        type: "string",
        description:
          "Two or three sentences on where the candidate is strong and where the gap is. When no resume was provided, summarize what a strong candidate would look like instead.",
      },
      employerPriorities: {
        type: "string",
        description:
          "One or two sentences naming what this employer actually prioritizes, inferred from repetition, ordering and emphasis in the posting. Example: 'The employer appears to prioritize React, Node.js and C#/.NET.'",
      },
      requiredSkills: {
        type: "array",
        description:
          "Every concrete skill the posting asks for. 8-16 items. Do not invent skills that are not in the posting.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            category: {
              type: "string",
              enum: [
                "language",
                "framework",
                "database",
                "cloud",
                "tooling",
                "practice",
                "soft-skill",
              ],
            },
            importance: {
              type: "string",
              enum: ["must-have", "nice-to-have"],
            },
            matched: {
              type: "boolean",
              description:
                "True only if the resume gives real evidence of this skill. False when no resume was provided.",
            },
            evidence: {
              type: "string",
              description:
                "Short quote or paraphrase from the resume backing the match, or a brief note on why it is not evidenced. Empty string when no resume was provided.",
            },
          },
          required: ["name", "category", "importance", "matched", "evidence"],
        },
      },
      missingSkills: {
        type: "array",
        description:
          "Skills the posting requires that the resume does not evidence. Empty array when no resume was provided.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            importance: {
              type: "string",
              enum: ["must-have", "nice-to-have"],
            },
            whyItMatters: {
              type: "string",
              description: "How this skill is used in this specific role.",
            },
            howToClose: {
              type: "string",
              description:
                "A concrete, week-scale action to close the gap — a project to build or a specific thing to learn. Not 'take a course'.",
            },
          },
          required: ["name", "importance", "whyItMatters", "howToClose"],
        },
      },
      keyResponsibilities: {
        type: "array",
        items: { type: "string" },
        description: "4-7 responsibilities, each rewritten as a plain sentence.",
      },
      interviewQuestions: {
        type: "array",
        description:
          "Exactly 10 questions drawn from THIS posting — reference its actual stack, domain and scale. No generic questions.",
        items: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: [
                "Technical",
                "Behavioral",
                "System Design",
                "Coding",
                "Project-specific",
              ],
            },
            question: { type: "string" },
            whyAsked: {
              type: "string",
              description: "What the interviewer is actually testing.",
            },
            answerHint: {
              type: "string",
              description:
                "Two or three sentences on the shape of a strong answer, including one concrete detail worth mentioning.",
            },
          },
          required: ["category", "question", "whyAsked", "answerHint"],
        },
      },
      resumeFeedback: {
        type: "array",
        description:
          "3-6 specific, actionable edits to make the resume land better for THIS role. Empty array when no resume was provided. Quote the resume when pointing at a problem.",
        items: {
          type: "object",
          properties: {
            severity: { type: "string", enum: ["high", "medium", "low"] },
            issue: {
              type: "string",
              description: "What is wrong, quoting the resume where possible.",
            },
            suggestion: {
              type: "string",
              description:
                "The concrete rewrite or addition. Where a metric is missing, show the shape of the line to aim for.",
            },
          },
          required: ["severity", "issue", "suggestion"],
        },
      },
      redFlags: {
        type: "array",
        items: { type: "string" },
        description:
          "0-4 concerns in the posting itself: unrealistic scope, vague ownership, a stack that suggests legacy debt, missing compensation. Empty array if the posting is clean.",
      },
    },
    required: [
      "role",
      "matchScore",
      "matchSummary",
      "employerPriorities",
      "requiredSkills",
      "missingSkills",
      "keyResponsibilities",
      "interviewQuestions",
      "resumeFeedback",
      "redFlags",
    ],
  },
};

export const SYSTEM_PROMPT = `You are a senior engineering hiring manager who has screened thousands of developer applications. You read a job posting the way a hiring manager writes one: you can tell which requirements are real and which are wishlist padding.

Rules you follow without exception:
- Ground every claim in the text you were given. Never invent a skill, a responsibility or a resume detail that is not there.
- Distinguish must-haves from nice-to-haves. A skill buried in a "bonus points" list is not a must-have, even if it appears twice.
- Normalize technology names to how the industry writes them (React, Node.js, TypeScript, .NET, PostgreSQL, CI/CD).
- Treat closely related technologies as evidence when matching, and say so in the evidence field: Express is evidence of Node.js; Next.js is evidence of React; Azure DevOps is partial evidence of Azure.
- Be specific and useful rather than encouraging. A candidate reading this should learn something they did not already know about the posting.
- Interview questions must be answerable only by someone who read THIS posting. Anchor them to its stack, domain and scale.

Then call the submit_job_analysis tool. That tool call is your entire response.`;

export function buildUserPrompt(
  jobDescription: string,
  resumeText?: string
): string {
  const jd = `<job_description>\n${jobDescription.trim()}\n</job_description>`;

  if (!resumeText || resumeText.trim().length === 0) {
    return `${jd}

No resume was provided.

Analyze the posting on its own:
- Set matchScore to 0, and set every skill's "matched" to false with an empty "evidence".
- Leave missingSkills and resumeFeedback as empty arrays.
- In matchSummary, describe what a strong candidate for this role looks like.

Fill in every other field fully.`;
  }

  return `${jd}

<resume>
${resumeText.trim()}
</resume>

Analyze the posting, then score this specific resume against it.

For matchScore, weight must-have skills about three times as heavily as nice-to-haves and adjust for seniority fit. Be honest — a score in the 50s with a clear path forward is more useful than an inflated 85.

For resumeFeedback, focus on what would change a screening decision for THIS role: unevidenced claims, responsibilities written without outcomes, missing keywords the posting leans on, and buried relevant experience.`;
}
