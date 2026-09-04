"use client";

import { useMemo, useState } from "react";
import type { InterviewQuestion } from "@/lib/types";
import CopyButton from "./CopyButton";

const CATEGORY_STYLES: Record<string, string> = {
  Technical: "bg-indigo-50 text-indigo-700",
  Behavioral: "bg-violet-50 text-violet-700",
  "System Design": "bg-sky-50 text-sky-700",
  Coding: "bg-emerald-50 text-emerald-700",
  "Project-specific": "bg-amber-50 text-amber-700",
};

export default function InterviewQuestions({
  questions,
}: {
  questions: InterviewQuestion[];
}) {
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(0);

  const categories = useMemo(() => {
    const seen = new Set(questions.map((q) => q.category));
    return ["All", ...Array.from(seen)];
  }, [questions]);

  const visible = useMemo(
    () =>
      questions
        .map((q, i) => ({ q, i }))
        .filter(({ q }) => filter === "All" || q.category === filter),
    [questions, filter]
  );

  if (questions.length === 0) return null;

  const allText = questions
    .map((q, i) => `${i + 1}. [${q.category}] ${q.question}`)
    .join("\n\n");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Interview questions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Generated from this posting — not a generic list.
          </p>
        </div>
        <CopyButton text={allText} label="Copy all" />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === c
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ol className="space-y-2">
        {visible.map(({ q, i }) => {
          const isOpen = open === i;
          return (
            <li key={i} className="overflow-hidden rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold tabular-nums text-slate-400">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-800">{q.question}</span>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${
                    CATEGORY_STYLES[q.category] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {q.category}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3.5 pl-12">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      What they&rsquo;re testing
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{q.whyAsked}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      A strong answer
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{q.answerHint}</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
