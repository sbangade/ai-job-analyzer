import type { AnalysisResult } from "@/lib/types";
import { AlertIcon } from "./Icons";
import InterviewQuestions from "./InterviewQuestions";
import MatchScore from "./MatchScore";
import ResumeFeedback from "./ResumeFeedback";
import { MissingSkills, RequiredSkills } from "./SkillsSection";

export default function ResultsPanel({ data }: { data: AnalysisResult }) {
  return (
    <div className="space-y-5">
      {/* Overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{data.role.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {data.role.seniority} · {data.role.yearsExperience}
            </p>

            {data.role.primaryStack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {data.role.primaryStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {data.matchSummary && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{data.matchSummary}</p>
            )}
          </div>

          <div className="shrink-0 sm:border-l sm:border-slate-100 sm:pl-6">
            {data.matchScore !== null ? (
              <MatchScore score={data.matchScore} />
            ) : (
              <div className="max-w-48 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm font-medium text-slate-700">No match score yet</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Add your resume above and run it again to score your fit and get tailoring
                  feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Employer priorities */}
      {data.employerPriorities && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
            What this employer actually prioritizes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {data.employerPriorities}
          </p>
        </section>
      )}

      <RequiredSkills skills={data.requiredSkills} hasResume={data.hasResume} />

      <MissingSkills skills={data.missingSkills} />

      <ResumeFeedback items={data.resumeFeedback} />

      {/* Responsibilities */}
      {data.keyResponsibilities.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">What you&rsquo;d actually do</h2>
          <ul className="mt-3 space-y-2">
            {data.keyResponsibilities.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <InterviewQuestions questions={data.interviewQuestions} />

      {/* Red flags */}
      {data.redFlags.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex items-center gap-2">
            <AlertIcon className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-amber-900">Worth asking about</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {data.redFlags.map((flag, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-amber-900/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {flag}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
