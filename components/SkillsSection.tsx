import type { MissingSkill, RequiredSkill } from "@/lib/types";
import { CheckIcon, XIcon } from "./Icons";

function ImportanceBadge({ importance }: { importance: string }) {
  const mustHave = importance === "must-have";
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        mustHave ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
      }`}
    >
      {mustHave ? "Must have" : "Nice to have"}
    </span>
  );
}

export function RequiredSkills({
  skills,
  hasResume,
}: {
  skills: RequiredSkill[];
  hasResume: boolean;
}) {
  if (skills.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Required skills</h2>
        {hasResume && (
          <span className="text-xs text-slate-500">
            {skills.filter((s) => s.matched).length} of {skills.length} evidenced in your resume
          </span>
        )}
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {skills.map((skill, i) => (
          <li
            key={`${skill.name}-${i}`}
            className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
          >
            {hasResume ? (
              skill.matched ? (
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              )
            ) : (
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{skill.name}</span>
                <ImportanceBadge importance={skill.importance} />
              </div>
              {hasResume && skill.evidence && (
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{skill.evidence}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MissingSkills({ skills }: { skills: MissingSkill[] }) {
  if (skills.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Gaps to close</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ranked by how much each one matters for this specific role.
      </p>

      <div className="mt-4 space-y-3">
        {skills.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="rounded-lg border border-slate-100 bg-slate-50/60 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{skill.name}</h3>
              <ImportanceBadge importance={skill.importance} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{skill.whyItMatters}</p>
            <p className="mt-2 border-l-2 border-indigo-300 pl-3 text-sm leading-relaxed text-slate-700">
              <span className="font-medium text-indigo-700">Close it: </span>
              {skill.howToClose}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
