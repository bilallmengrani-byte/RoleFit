export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  keywords?: string[];
  url?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
}

export interface ResumeData {
  basics: BasicInfo;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
}

export interface MatchedSkill {
  skill: string;
  category: string;
  cvEvidence: string;
  relevance: 'high' | 'medium';
  strength?: string;
}

export interface PartiallyMatchedSkill {
  skill: string;
  category: string;
  cvEvidence: string;
  boundary: string;
  recommendation: string;
}

export interface MissingSkill {
  skill: string;
  priority: 'critical' | 'preferred';
  category?: string;
  advice: string;
  alternativeStrength?: string;
}

export interface ImportantJobRequirement {
  id: string;
  requirement: string;
  category: string;
  isMet: boolean;
  matchLevel: 'full' | 'partial' | 'gap';
  evidenceOrGap: string;
}

export interface KeywordGap {
  keyword: string;
  occurrencesInJD: number;
  importance: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface MatchBreakdown {
  hardSkills: number;
  experienceFit: number;
  impactAndMetrics: number;
  domainMatch: number;
}

export interface AnalysisData {
  overallScore: number;
  scoreCategory: string;
  breakdown: MatchBreakdown;
  summary: string;
  keyStrengths: string[];
  importantJobRequirements: ImportantJobRequirement[];
  matchedSkills: MatchedSkill[];
  partiallyMatchedSkills: PartiallyMatchedSkill[];
  missingSkills: MissingSkill[];
  keywordGaps: KeywordGap[];
  recommendations: string[];
  isFallbackMode?: boolean;
  modeNote?: string;
  executionTimeMs?: number;
}

export interface CVChangeLog {
  id: string;
  section: 'summary' | 'skills' | 'experience' | 'projects' | 'title';
  targetContext: string;
  originalSnippet: string;
  newSnippet: string;
  reason: string;
  hallucinationCheck: string;
  changeType?: 'rewrite' | 'reorder' | 'keyword-emphasis' | 'clarity-improvement' | 'de-emphasis';
}

export interface InterviewTalkingPoint {
  topic: string;
  howToAddress: string;
  honestBoundary: string;
}

export interface TailorResponse {
  analysis: AnalysisData;
  tailoredCV: ResumeData;
  changes: CVChangeLog[];
  interviewTalkingPoints: InterviewTalkingPoint[];
}

export interface TargetJob {
  title: string;
  company: string;
  location?: string;
  rawText: string;
  keyRequirements?: string[];
}
