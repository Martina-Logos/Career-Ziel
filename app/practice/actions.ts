'use server'
// app/practice/actions.ts
// ALL OpenAI calls go through here — never import lib/ai.ts in a Client Component.
// These are Next.js Server Actions: they run on the server, never in the browser.

import { generateQuestions, evaluateAnswer, generateSessionSummary } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'
import type { SessionConfig } from '@/lib/ai'

// ─── Start a session ─────────────────────────────────────────────────────────
// Creates the session row in Supabase and returns the generated questions.

export async function startSessionAction(config: SessionConfig) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 1. Generate questions via OpenAI (server-side only)
  const questions = await generateQuestions(config)

  // 2. Create session row in DB
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      role: config.role,
      difficulty: config.difficulty,
      question_types: config.questionTypes,
      job_description: config.jobDescription ?? null,
      persona_id: config.personaId,
      status: 'in_progress',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  return { sessionId: session.id, questions }
}

// ─── Submit an answer ─────────────────────────────────────────────────────────
// Evaluates one answer and writes the result to session_answers.

export async function submitAnswerAction(params: {
  sessionId: string
  personaId: string
  role: string
  question: { index: number; text: string; type: 'technical' | 'behavioral' | 'general' }
  answer: string
  timeTakenSeconds: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 1. Evaluate with AI
  const evaluation = await evaluateAnswer({
    personaId: params.personaId,
    role: params.role,
    question: { index: params.question.index, text: params.question.text, type: params.question.type },
    answer: params.answer,
    timeTakenSeconds: params.timeTakenSeconds,
  })

  // 2. Save answer + score to DB
  const { error } = await supabase
    .from('session_answers')
    .insert({
      session_id: params.sessionId,
      user_id: user.id,
      question_index: params.question.index,
      question_text: params.question.text,
      question_type: params.question.type,
      answer_text: params.answer,
      score: evaluation.score,
      ai_feedback: evaluation.feedback,
      improvement_tip: evaluation.improvementTip,
      time_taken_secs: params.timeTakenSeconds,
    })

  if (error) throw new Error(error.message)

  return evaluation
}

// ─── Complete a session ───────────────────────────────────────────────────────
// Calculates overall score, generates summary, marks session complete.

export async function completeSessionAction(params: {
  sessionId: string
  personaId: string
  role: string
  answers: Array<{ question: string; answer: string; score: number; feedback: string }>
  durationSecs: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const scores = params.answers.map(a => a.score).filter(s => s > 0)
  const overallScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  // 1. Generate AI summary
  const summary = await generateSessionSummary({
    personaId: params.personaId,
    role: params.role,
    answers: params.answers,
    overallScore,
  })

  // 2. Update session row
  await supabase
    .from('sessions')
    .update({
      status: 'completed',
      overall_score: overallScore,
      duration_secs: params.durationSecs,
      completed_at: new Date().toISOString(),
    })
    .eq('id', params.sessionId)
    .eq('user_id', user.id)

  // 3. Update streak
  await supabase.rpc('update_streak', { p_user_id: user.id })

  return { overallScore, summary }
}

// ─── Abandon a session ────────────────────────────────────────────────────────

export async function abandonSessionAction(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('sessions')
    .update({ status: 'abandoned' })
    .eq('id', sessionId)
    .eq('user_id', user.id)
}