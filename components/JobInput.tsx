"use client";

import { SAMPLE_JOB_DESCRIPTION } from "@/lib/sample";

export default function JobInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Job description</h2>
          <p className="text-xs text-slate-500">Required</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(SAMPLE_JOB_DESCRIPTION)}
          disabled={disabled}
          className="text-xs font-medium text-indigo-600 transition hover:text-indigo-800 disabled:opacity-40"
        >
          Load sample
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the full posting here — responsibilities, requirements, nice-to-haves, all of it. The more you paste, the sharper the analysis."
        className="min-h-64 flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
      />

      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{value.trim() ? `${value.trim().length.toLocaleString()} characters` : " "}</span>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            className="font-medium transition hover:text-slate-600 disabled:opacity-40"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
