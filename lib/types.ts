export type SkillImportance = "must-have" | "nice-to-have";

export type SkillCategory =
  | "language"
  | "framework"
  | "database"
  | "cloud"
  | "tooling"
  | "practice"
  | "soft-skill";

export interface RequiredSkill {
  name: string;
  category: SkillCategory;
  importance: SkillImportance;
  /** True only when a resume was supplied and the skill is evidenced there. */
  matched: boolean;
  /** Where it showed up in the resume, or why it could not be matched. */
  evidence: string;
}

export interface MissingSkill {
  name: string;
  importance: SkillImportance;
  whyItMatters: string;
  howToClose: string;
}

export type QuestionCategory =
  | "Technical"
  | "Behavioral"
  | "System Design"
  | "Coding"
  | "Project-specific";

export interface InterviewQuestion {
  category: QuestionCategory;
  question: string;
  whyAsked: string;
  answerHint: string;
}

export type FeedbackSeverity = "high" | "medium" | "low";

export interface ResumeFeedbackItem {
  severity: FeedbackSeverity;
  issue: string;
  suggestion: string;
}

export interface RoleSummary {
  title: string;
  seniority: string;
  yearsExperience: string;
  primaryStack: string[];
}

export interface AnalysisResult {
  role: RoleSummary;
  /** 0-100. Null when no resume was supplied. */
  matchScore: number | null;
  matchSummary: string;
  employerPriorities: string;
  requiredSkills: RequiredSkill[];
  missingSkills: MissingSkill[];
  keyResponsibilities: string[];
  interviewQuestions: InterviewQuestion[];
  resumeFeedback: ResumeFeedbackItem[];
  /** Vague requirements, unrealistic asks, scope creep in the JD. */
  redFlags: string[];
  /** True when the analysis included a resume. */
  hasResume: boolean;
}

export interface AnalyzeRequest {
  jobDescription: string;
  resumeText?: string;
}

export interface ApiError {
  error: string;
}
