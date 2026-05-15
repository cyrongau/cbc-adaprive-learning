export type UserRole = 'student' | 'admin' | 'teacher';
export type QuestionType = 'mcq' | 'structured' | 'mathematical';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type UploadStatus = 'uploaded' | 'ocr_processing' | 'needs_review' | 'approved' | 'rejected';
export type SchoolTerm = 'term-one' | 'term-two' | 'term-three';
export type StudentLevel = 'emerging' | 'approaching' | 'meeting' | 'exceeding';
export type OnboardingStatus = 'not_started' | 'diagnostic_ready' | 'profiled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade?: number;
  schoolTerm?: SchoolTerm;
  onboardingStatus?: OnboardingStatus;
}

export interface AuthCredential {
  userId: string;
  passwordHash: string;
}

export interface Subject {
  id: string;
  name: string;
  gradeRange: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  strand: string;
  competency: string;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  competencyTags: string[];
  latex?: string;
  source: string;
}

export interface Attempt {
  id: string;
  studentId: string;
  questionId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  score: number;
  createdAt: string;
}

export interface PaperUpload {
  id: string;
  title: string;
  subjectId: string;
  uploadedBy: string;
  status: UploadStatus;
  fileName: string;
  createdAt: string;
}

export interface OcrResult {
  id: string;
  uploadId: string;
  extractedText: string;
  structuredQuestionCount: number;
  confidence: number;
  reviewNotes: string[];
}

export interface OnboardingQuestion {
  id: string;
  subjectId: string;
  topicId: string;
  prompt: string;
  intent: 'coverage_check' | 'diagnostic';
  expectedSignal: string;
  difficulty: Difficulty;
}

export interface StudentProfile {
  studentId: string;
  grade: number;
  schoolTerm: SchoolTerm;
  level: StudentLevel;
  coveredTopicIds: string[];
  recommendedTopicIds: string[];
  weakTopicIds: string[];
  confidence: number;
  updatedAt: string;
}
