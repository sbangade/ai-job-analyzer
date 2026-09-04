const STEPS = [
  "Reading the posting",
  "Separating must-haves from wishlist items",
  "Scoring your fit",
  "Writing interview questions",
];

export default function LoadingState({ hasResume }: { hasResume: boolean }) {
  const steps = hasResume ? STEPS : STEPS.filter((s) => !s.startsWith("Scoring"));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2 text-sm text-slate-500">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500"
                style={{ animationDelay: `${i * 220}ms` }}
              />
              {step}
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <div className="h-6 w-2/5 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-11 animate-pulse rounded-lg bg-slate-50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
