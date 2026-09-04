"use client";

import { useRef, useState } from "react";
import JobInput from "@/components/JobInput";
import LoadingState from "@/components/LoadingState";
import ResultsPanel from "@/components/ResultsPanel";
import ResumeInput from "@/components/ResumeInput";
import { AlertIcon, SpinnerIcon } from "@/components/Icons";
import type { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const canAnalyze = jobDescription.trim().length >= 80 && !loading;

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    // Move the viewport to the results area so the loading state is visible.
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );

    try {
      const res = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeText: resumeText.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed.");
      setResult(data as AnalysisResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          AI Job Description Analyzer
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Paste a posting to see what it really requires, how your resume scores against it,
          and the questions you should expect in the interview.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <JobInput value={jobDescription} onChange={setJobDescription} disabled={loading} />
        <ResumeInput value={resumeText} onChange={setResumeText} disabled={loading} />
      </div>

      <div className="mt-5 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={analyze}
          disabled={!canAnalyze}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {loading && <SpinnerIcon className="h-4 w-4" />}
          {loading ? "Analyzing…" : "Analyze job"}
        </button>
        <p className="text-xs text-slate-400">
          {jobDescription.trim().length === 0
            ? "Paste a job description to get started"
            : jobDescription.trim().length < 80
              ? "Paste a bit more of the posting"
              : resumeText.trim()
                ? "Resume included — you'll get a match score"
                : "Add your resume for a match score and tailoring feedback"}
        </p>
      </div>

      <div ref={resultsRef} className="mt-10 scroll-mt-6">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4"
          >
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-medium text-rose-900">Analysis failed</p>
              <p className="mt-1 text-sm leading-relaxed text-rose-800">{error}</p>
            </div>
          </div>
        )}

        {loading && <LoadingState hasResume={Boolean(resumeText.trim())} />}

        {!loading && !error && result && <ResultsPanel data={result} />}

        {!loading && !error && !result && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
            <p className="text-sm font-medium text-slate-700">No analysis yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-slate-500">
              Results appear here: a skill-by-skill breakdown, the gaps worth closing, ten
              interview questions written from this posting, and — with a resume — a match score
              and specific edits.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        Built with Next.js and the Anthropic API. Nothing you paste is stored.
      </footer>
    </main>
  );
}
