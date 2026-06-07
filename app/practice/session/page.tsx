'use client'
// app/practice/session/page.tsx
// Client Component — handles UI state only.
// All AI + DB calls go through Server Actions in app/practice/actions.ts.

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPersona } from '@/lib/personas'
import {
  startSessionAction,
  submitAnswerAction,
  completeSessionAction,
  abandonSessionAction,
} from '@/app/practice/actions'

type Phase = 'loading' | 'question' | 'submitting' | 'feedback' | 'complete' | 'error'

interface Question {
  index: number
  text: string
  type: 'technical' | 'behavioral' | 'general'
  hint?: string
}

interface AnswerResult {
  score: number
  feedback: string
  improvementTip: string
}

interface CompletedAnswer {
  question: string
  answer: string
  score: number
  feedback: string
}

const TYPE_LABEL: Record<string, string> = {
  technical: 'Technical',
  behavioral: 'Behavioral',
  general: 'General',
}

const TYPE_COLOR: Record<string, string> = {
  technical: 'var(--color-cz-blue-deep)',
  behavioral: 'var(--color-cz-burg)',
  general: 'var(--color-cz-green)',
}

function scoreColor(score: number) {
  if (score >= 80) return '#4A7A5A'
  if (score >= 60) return '#A0622A'
  return '#8B3535'
}

export default function SessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Config from URL params (set by practice setup page)
  const personaId   = searchParams.get('persona')   ?? 'friendly'
  const role        = searchParams.get('role')       ?? 'Software Engineer'
  const difficulty  = (searchParams.get('difficulty') ?? 'mid') as 'junior' | 'mid' | 'senior'
  const typesParam  = searchParams.get('types')      ?? 'technical,behavioral,general'
  const questionTypes = typesParam.split(',') as Array<'technical' | 'behavioral' | 'general'>

  const persona = getPersona(personaId)

  // Session state
  const [phase, setPhase] = useState<Phase>('loading')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null)
  const [completedAnswers, setCompletedAnswers] = useState<CompletedAnswer[]>([])
  const [finalResult, setFinalResult] = useState<{
    overallScore: number
    summary: { headline: string; strengths: string[]; improvements: string[]; nextSteps: string }
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Timer
  const timerLimit = persona?.timerSeconds ?? 180
  const [timeLeft, setTimeLeft] = useState(timerLimit)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const sessionStartRef = useRef<number>(Date.now())

  // Start session on mount
  useEffect(() => {
    sessionStartRef.current = Date.now()
    startSessionAction({ personaId, role, difficulty, questionTypes })
      .then(({ sessionId: sid, questions: qs }) => {
        setSessionId(sid)
        setQuestions(qs)
        setPhase('question')
        startTimer()
      })
      .catch(err => {
        setErrorMsg(err.message ?? 'Failed to start session')
        setPhase('error')
      })

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startTimer() {
    startTimeRef.current = Date.now()
    setTimeLeft(timerLimit)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit(true) // auto-submit when time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = useCallback(async (timedOut = false) => {
    if (!sessionId || phase === 'submitting') return
    if (timerRef.current) clearInterval(timerRef.current)

    const currentQuestion = questions[currentIndex]
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    const submittedAnswer = timedOut ? answer || '[No answer — time ran out]' : answer

    setPhase('submitting')

    try {
      const result = await submitAnswerAction({
        sessionId,
        personaId,
        role,
        question: currentQuestion,
        answer: submittedAnswer,
        timeTakenSeconds: timeTaken,
      })

      setLastResult(result)
      setCompletedAnswers(prev => [...prev, {
        question: currentQuestion.text,
        answer: submittedAnswer,
        score: result.score,
        feedback: result.feedback,
      }])
      setPhase('feedback')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Evaluation failed')
      setPhase('error')
    }
  }, [sessionId, phase, questions, currentIndex, answer, personaId, role])

  async function handleNext() {
    const nextIndex = currentIndex + 1

    if (nextIndex >= questions.length) {
      // Complete the session
      setPhase('submitting')
      const durationSecs = Math.round((Date.now() - sessionStartRef.current) / 1000)

      try {
        const result = await completeSessionAction({
          sessionId: sessionId!,
          personaId,
          role,
          answers: completedAnswers,
          durationSecs,
        })
        setFinalResult(result)
        setPhase('complete')
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to complete session')
        setPhase('error')
      }
    } else {
      setCurrentIndex(nextIndex)
      setAnswer('')
      setLastResult(null)
      setPhase('question')
      startTimer()
    }
  }

  async function handleAbandon() {
    if (sessionId) await abandonSessionAction(sessionId)
    router.push('/dashboard')
  }

  // ── Timer display
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timerPct = (timeLeft / timerLimit) * 100
  const timerUrgent = timeLeft <= 30

  // ── Loading ───────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div style={styles.center}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{persona?.emoji ?? '🎯'}</div>
          <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-cz-text)', margin: '0 0 0.5rem' }}>
            Preparing your session…
          </p>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-cz-muted)', margin: 0 }}>
            {persona?.name} is getting your questions ready
          </p>
        </div>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div style={styles.center}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-cz-text)', margin: '0 0 0.5rem' }}>
            Something went wrong
          </p>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-cz-muted)', margin: '0 0 1.5rem' }}>{errorMsg}</p>
          <button onClick={() => router.push('/practice')} style={styles.btnPrimary}>
            Back to practice
          </button>
        </div>
      </div>
    )
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  if (phase === 'complete' && finalResult) {
    const { overallScore, summary } = finalResult
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Score header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
            background: `${scoreColor(overallScore)}18`,
            border: `3px solid ${scoreColor(overallScore)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.5rem',
            color: scoreColor(overallScore),
          }}>
            {overallScore}%
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-cz-text)', margin: '0 0 0.5rem' }}>
            Session complete
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-cz-muted)', margin: 0 }}>
            {summary.headline}
          </p>
        </div>

        {/* Strengths + improvements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ ...styles.card, borderColor: '#4A7A5A40' }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.825rem', color: '#4A7A5A' }}>✓ Strengths</p>
            {summary.strengths.map((s, i) => (
              <p key={i} style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: 'var(--color-cz-muted)', lineHeight: 1.5 }}>· {s}</p>
            ))}
          </div>
          <div style={{ ...styles.card, borderColor: '#A0622A40' }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.825rem', color: '#A0622A' }}>↑ Improve</p>
            {summary.improvements.map((s, i) => (
              <p key={i} style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: 'var(--color-cz-muted)', lineHeight: 1.5 }}>· {s}</p>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div style={{ ...styles.card, marginBottom: '1.5rem', background: 'var(--color-cz-burg-dim)', borderColor: 'var(--color-cz-burg-border)' }}>
          <p style={{ margin: '0 0 0.4rem', fontWeight: 600, fontSize: '0.825rem', color: 'var(--color-cz-burg)' }}>Next steps</p>
          <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-cz-text)', lineHeight: 1.6 }}>{summary.nextSteps}</p>
        </div>

        {/* Per-question review */}
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-cz-text)', margin: '0 0 0.875rem' }}>
          Answer review
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {completedAnswers.map((a, i) => (
            <div key={i} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--color-cz-muted)' }}>Q{i + 1}</span>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: scoreColor(a.score) }}>{a.score}%</span>
              </div>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-text)' }}>{a.question}</p>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--color-cz-muted)', lineHeight: 1.5 }}>{a.answer}</p>
              <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-cz-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>{a.feedback}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => router.push('/practice')} style={{ ...styles.btnPrimary, flex: 1 }}>
            Practice again
          </button>
          <button onClick={() => router.push('/analytics')} style={{ ...styles.btnSecondary, flex: 1 }}>
            View analytics
          </button>
        </div>
      </div>
    )
  }

  // ── Active question or feedback ───────────────────────────────────────────
  const currentQ = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{persona?.emoji}</span>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-muted)' }}>
            {persona?.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-cz-muted)' }}>
            {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={handleAbandon}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.775rem', color: 'var(--color-cz-muted)' }}
          >
            Quit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--color-cz-border)', borderRadius: 2, marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-cz-burg)', borderRadius: 2, transition: 'width 0.3s ease' }}/>
      </div>

      {phase === 'feedback' && lastResult ? (
        /* ── Feedback view ── */
        <div>
          <div style={{
            ...styles.card,
            borderColor: `${scoreColor(lastResult.score)}40`,
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-muted)' }}>Your score</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-syne)', color: scoreColor(lastResult.score) }}>
                {lastResult.score}%
              </span>
            </div>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--color-cz-text)', lineHeight: 1.6 }}>
              {lastResult.feedback}
            </p>
            <div style={{ padding: '0.6rem 0.75rem', background: 'var(--color-cz-burg-dim)', borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-cz-burg)', lineHeight: 1.5 }}>
                <strong>Tip:</strong> {lastResult.improvementTip}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            style={styles.btnPrimary}
          >
            {currentIndex + 1 >= questions.length ? 'See final results →' : 'Next question →'}
          </button>
        </div>
      ) : (
        /* ── Question view ── */
        <div>
          {/* Type badge */}
          {currentQ && (
            <span style={{
              display: 'inline-block',
              padding: '0.2rem 0.65rem',
              borderRadius: 20,
              fontSize: '0.725rem',
              fontWeight: 600,
              background: `${TYPE_COLOR[currentQ.type]}18`,
              color: TYPE_COLOR[currentQ.type],
              marginBottom: '1rem',
              letterSpacing: '0.02em',
            }}>
              {TYPE_LABEL[currentQ.type]}
            </span>
          )}

          {/* Question */}
          <div style={{ ...styles.card, marginBottom: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-cz-text)', lineHeight: 1.6 }}>
              {currentQ?.text}
            </p>
          </div>

          {/* Timer */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-cz-muted)' }}>Time remaining</span>
              <span style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: timerUrgent ? '#8B3535' : 'var(--color-cz-text)',
                fontFamily: 'var(--font-syne)',
              }}>
                {mins}:{secs.toString().padStart(2, '0')}
              </span>
            </div>
            <div style={{ height: 4, background: 'var(--color-cz-border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${timerPct}%`,
                background: timerUrgent ? '#8B3535' : 'var(--color-cz-burg)',
                borderRadius: 2,
                transition: 'width 1s linear, background 0.3s',
              }}/>
            </div>
          </div>

          {/* Answer textarea */}
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            rows={6}
            disabled={phase === 'submitting'}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: 8,
              border: '1px solid var(--color-cz-border2)',
              background: 'var(--color-cz-surface2)',
              color: 'var(--color-cz-text)',
              fontSize: '0.9rem',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              marginBottom: '1rem',
              opacity: phase === 'submitting' ? 0.6 : 1,
            }}
          />

          <button
            onClick={() => handleSubmit(false)}
            disabled={phase === 'submitting' || !answer.trim()}
            style={{
              ...styles.btnPrimary,
              opacity: phase === 'submitting' || !answer.trim() ? 0.5 : 1,
              cursor: phase === 'submitting' || !answer.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {phase === 'submitting' ? 'Evaluating…' : 'Submit answer'}
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  center: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  card: {
    background: 'var(--color-cz-surface)',
    border: '1px solid var(--color-cz-border)',
    borderRadius: 10,
    padding: '1rem',
  } as React.CSSProperties,
  btnPrimary: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: 8,
    border: 'none',
    background: 'var(--color-cz-burg)',
    color: 'var(--color-cz-bg)',
    fontFamily: 'var(--font-syne)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  } as React.CSSProperties,
  btnSecondary: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: 8,
    border: '1px solid var(--color-cz-border2)',
    background: 'var(--color-cz-surface)',
    color: 'var(--color-cz-text)',
    fontFamily: 'var(--font-syne)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  } as React.CSSProperties,
}