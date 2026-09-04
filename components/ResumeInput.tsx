"use client";

import { useRef, useState } from "react";
import { SpinnerIcon, UploadIcon } from "./Icons";

type Mode = "paste" | "upload";

export default function ResumeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [mode, setMode] = useState<Mode>("paste");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      onChange(data.text);
      setFilename(data.filename);
      setMode("paste");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      disabled={disabled}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition disabled:opacity-40 ${
        mode === m
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Your resume</h2>
          <p className="text-xs text-slate-500">Optional — unlocks match score and feedback</p>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {tab("paste", "Paste")}
          {tab("upload", "Upload")}
        </div>
      </div>

      {mode === "paste" ? (
        <>
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setFilename(null);
            }}
            disabled={disabled}
            placeholder="Paste your resume text here, or switch to Upload for a PDF or DOCX."
            className="min-h-64 flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>
              {filename
                ? `Loaded from ${filename}`
                : value.trim()
                  ? `${value.trim().length.toLocaleString()} characters`
                  : " "}
            </span>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setFilename(null);
                }}
                disabled={disabled}
                className="font-medium transition hover:text-slate-600 disabled:opacity-40"
              >
                Clear
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-64 flex-1 flex-col">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40 disabled:opacity-60"
          >
            {uploading ? (
              <SpinnerIcon className="h-6 w-6 text-indigo-600" />
            ) : (
              <UploadIcon className="h-6 w-6 text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-700">
              {uploading ? "Reading your resume…" : "Choose a file"}
            </span>
            <span className="text-xs text-slate-400">PDF, DOCX, TXT or MD · up to 5 MB</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {uploadError && (
            <p className="mt-2 text-xs text-rose-600">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
}
