# AI Job Description Analyzer

Paste a job posting and get back what it actually requires — separated into must-haves and wishlist padding — plus a match score against your resume, the gaps worth closing, ten interview questions written from that specific posting, and concrete resume edits.

Built with Next.js 15, TypeScript, Tailwind CSS v4, and the Anthropic API.

![Status](https://img.shields.io/badge/status-MVP-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## What it does

| Feature | Needs a resume? |
| --- | --- |
| Role summary — title, seniority, years, primary stack | No |
| Must-have vs. nice-to-have skill breakdown | No |
| What the employer actually prioritizes | No |
| Responsibilities rewritten in plain language | No |
| 10 interview questions with "what they're testing" and answer hints | No |
| Red flags in the posting itself | No |
| **Match score (0–100)** | Yes |
| **Per-skill evidence from your resume** | Yes |
| **Gaps to close, with a week-scale action for each** | Yes |
| **Resume edits ranked by severity** | Yes |

Resumes can be pasted, or uploaded as PDF, DOCX, TXT or MD.

---

## Setup

### 1. Prerequisites

- **Node.js 18.18 or newer** — check with `node -v`. Get it from [nodejs.org](https://nodejs.org).
- **An Anthropic API key** — create one at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). You need a small amount of credit on the account; each analysis costs roughly 2–5 cents.

### 2. Install dependencies

From the project folder:

```bash
npm install
```

### 3. Add your API key

Copy the example env file:

```bash
cp .env.example .env.local
```

Then open `.env.local` and replace the placeholder with your real key:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

`.env.local` is already in `.gitignore`, so your key will not be committed.

### 4. Run it

```bash
npm run dev
```

Open **http://localhost:3000**. Click **Load sample** to try it without finding a posting first.

---

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without building |

---

## How it works

```
Browser (React)
      │  POST /api/analyze-job  { jobDescription, resumeText? }
      ▼
Next.js route handler          ← validates input, enforces size limits
      │
      ▼
lib/anthropic.ts               ← calls the Anthropic API
      │                          with a forced tool call
      ▼
Anthropic API                  ← returns schema-valid JSON, not prose
      │
      ▼
normalize()                    ← clamps + defaults anything malformed
      │
      ▼
Typed AnalysisResult → React components
```

### The part worth explaining in an interview

The analysis does **not** ask the model to "return JSON" and then hope. It defines a single tool (`submit_job_analysis` in `lib/prompts.ts`) with a full JSON Schema and sets `tool_choice` to require it:

```ts
tools: [ANALYSIS_TOOL],
tool_choice: { type: "tool", name: "submit_job_analysis" },
```

The API validates the model's output against that schema before it comes back, so `JSON.parse` failures and missing fields stop being a class of bug. The schema's `description` fields double as instructions — that is where the scoring weights and the "no generic questions" rule live, right next to the field they govern.

Output is still normalized in `lib/anthropic.ts` before it reaches React. Schema-valid is not the same as sane, and clamping the score to 0–100 costs nothing.

---

## Project structure

```
app/
  layout.tsx                    Root layout and metadata
  page.tsx                      Main page — all client state lives here
  globals.css                   Tailwind entry + base styles
  api/
    analyze-job/route.ts        Validation → analysis → typed JSON
    parse-resume/route.ts       PDF / DOCX / TXT → plain text
components/
  JobInput.tsx                  Job description textarea + sample loader
  ResumeInput.tsx               Paste / upload tabs
  ResultsPanel.tsx              Composes the result sections
  MatchScore.tsx                SVG score ring
  SkillsSection.tsx             Required skills + gaps to close
  InterviewQuestions.tsx        Filterable, expandable question list
  ResumeFeedback.tsx            Severity-ranked resume edits
  LoadingState.tsx              Skeleton + progress steps
  CopyButton.tsx                Clipboard button with copied state
  Icons.tsx                     Inline SVG icons (no icon library)
lib/
  anthropic.ts                  API client, error mapping, normalization
  prompts.ts                    System prompt + tool schema
  types.ts                      Shared types
  sample.ts                     Sample job description
```

---

## Deploying to Vercel

1. Push the project to GitHub.
2. At [vercel.com/new](https://vercel.com/new), import the repo. Vercel detects Next.js automatically — no build settings to change.
3. Before deploying, add an environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key
4. Deploy.

To redeploy after changes, push to your default branch.

> The analyze route sets `maxDuration = 60`. If your plan caps function duration lower, reduce it in `app/api/analyze-job/route.ts`.

---

## Troubleshooting

**"ANTHROPIC_API_KEY is not set"**
The file must be named exactly `.env.local` and sit in the project root next to `package.json`. Restart the dev server after creating it — env files are read at startup.

**"Anthropic rejected the API key"**
The key is wrong or was revoked. Generate a fresh one in the console. Keys start with `sk-ant-`.

**"The model ... is not available on this account"**
Set `ANTHROPIC_MODEL` in `.env.local` to a model you have access to. To see your list:

```bash
curl https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

**"Almost no text came out of that file"**
The PDF is a scan, not real text. Paste the resume instead.

**Copy buttons do nothing**
The clipboard API needs a secure context. `localhost` and any `https://` deployment work; a raw LAN IP over `http://` does not.

---

## Cost and privacy

Each analysis is one API call, typically 2–5 cents depending on how long the posting and resume are. Nothing is stored — there is no database, and job descriptions and resumes exist only for the duration of the request.

---

## Where to take it next

- Save a resume once in `localStorage` instead of pasting it every time
- Analysis history, so you can compare postings side by side
- A "tailor my resume" action that produces a rewritten version, not just notes
- Chrome extension that reads the posting off LinkedIn or Indeed directly
- Cover letter draft from the same analysis
- Accounts and Stripe, if you take it past a portfolio piece

---

## License

MIT
