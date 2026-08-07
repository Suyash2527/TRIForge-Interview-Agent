export interface CurriculumModule {
  n: number;
  title: string;
  days: number[];
}

export interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface Curriculum {
  modules: CurriculumModule[];
  days: CurriculumDay[];
}

export interface CandidateMission {
  day: number;
  title: string;
  passed: boolean;
  skipped: boolean;
  attempts: number;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface Candidate {
  member: {
    id: string;
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
  };
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export interface Feedback {
  grade: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}
