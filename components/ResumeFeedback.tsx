import type { ResumeFeedbackItem } from "@/lib/types";

const SEVERITY: Record<string, { dot: string; label: string; text: string }> = {
  high: { dot: "bg-rose-500", label: "Fix first", text: "text-rose-700" },
  medium: { dot: "bg-amber-500", label: "Worth fixing", text: "text-amber-700" },
  low: { dot: "bg-slate-400", label: "Polish", text: "text-slate-600" },
};

export default function ResumeFeedback({ items }: { items: ResumeFeedbackItem[] }) {
  if (items.length === 0) return null;

  const order = { high: 0, medium: 1, low: 2 } as const;
  const sorted = [...items].sort(
    (a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Resume fixes for this role</h2>
      <p className="mt-1 text-sm text-slate-500">
        Tailoring edits, not a general resume review.
      </p>

      <div className="mt-4 space-y-3">
        {sorted.map((item, i) => {
          const tone = SEVERITY[item.severity] ?? SEVERITY.low;
          return (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${tone.text}`}>
                  {tone.label}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.issue}</p>
              <p className="mt-2 border-l-2 border-emerald-300 pl-3 text-sm leading-relaxed text-slate-700">
                <span className="font-medium text-emerald-700">Instead: </span>
                {item.suggestion}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
