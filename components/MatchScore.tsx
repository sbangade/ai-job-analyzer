function scoreTone(score: number) {
  if (score >= 75) return { stroke: "#059669", text: "text-emerald-700", label: "Strong match" };
  if (score >= 55) return { stroke: "#d97706", text: "text-amber-700", label: "Partial match" };
  return { stroke: "#e11d48", text: "text-rose-700", label: "Weak match" };
}

export default function MatchScore({ score }: { score: number }) {
  const tone = scoreTone(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={tone.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-slate-900">{score}</span>
          <span className="text-xs font-medium text-slate-400">out of 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${tone.text}`}>{tone.label}</span>
      <span className="sr-only">Resume match score: {score} out of 100.</span>
    </div>
  );
}
