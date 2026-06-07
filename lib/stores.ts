'use client'

import { useSyncExternalStore } from 'react'
import { mockQuestions } from '@/lib/mock-data'

type InterviewConfig = {
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  mode: 'text' | 'video'
  role: string
  type: 'behavioral' | 'technical' | 'case-study' | 'mixed'
}

type InterviewState = {
  answers: string[]
  currentQuestionIndex: number
  currentSession: (InterviewConfig & { startedAt: string }) | null
  questions: typeof mockQuestions
}

const listeners = new Set<() => void>()

let state: InterviewState = {
  answers: [],
  currentQuestionIndex: 0,
  currentSession: null,
  questions: mockQuestions.slice(0, 5),
}

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

export function useInterview() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    ...snapshot,
    endSession() {
      state = { answers: [], currentQuestionIndex: 0, currentSession: null, questions: mockQuestions.slice(0, 5) }
      emit()
    },
    nextQuestion() {
      state = { ...state, currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1) }
      emit()
    },
    startSession(config: InterviewConfig) {
      state = {
        answers: [],
        currentQuestionIndex: 0,
        currentSession: { ...config, startedAt: new Date().toISOString() },
        questions: mockQuestions.slice(0, 5),
      }
      emit()
    },
    submitAnswer(answer: string) {
      const answers = [...state.answers]
      answers[state.currentQuestionIndex] = answer
      state = { ...state, answers }
      emit()
    },
  }
}
