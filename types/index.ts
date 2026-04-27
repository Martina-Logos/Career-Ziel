export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive'
export type InterviewType = 'behavioral' | 'technical' | 'general' | 'case-study'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type PracticeMode = 'text' | 'video'
export type SubscriptionTier = 'free' | 'pro'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  currentRole: string
  targetRole: string
  industry: string
  experienceLevel: ExperienceLevel
  tier: SubscriptionTier
  streak: number
  totalSessions: number
  createdAt: string
}

export interface Question {
  id: string
  text: string
  type: InterviewType
  hint?: string
  difficulty: Difficulty
}

export interface Answer {
  questionId: string
  text: string
  duration: number
}

export interface QuestionFeedback {
  questionId: string
  score: number
  clarity: number
  confidence: number
  relevance: number
  technicalAccuracy?: number
  strengths: string
  improvements: string
  summary: string
}

export interface Session {
  id: string
  userId: string
  role: string
  industry: string
  interviewType: InterviewType
  difficulty: Difficulty
  mode: PracticeMode
  questions: Question[]
  answers: Answer[]
  feedbacks: QuestionFeedback[]
  overallScore: number
  duration: number
  completedAt: string
}

export interface JobDescription {
  id: string
  title: string
  company: string
  content: string
  skills: string[]
  qualifications: string[]
  addedAt: string
}

export interface Analytics {
  scoreHistory: { date: string; score: number }[]
  skillBreakdown: { skill: string; score: number }[]
  sessionsByType: { type: string; count: number }[]
  totalSessions: number
  totalHours: number
  averageScore: number
  improvement: number
}