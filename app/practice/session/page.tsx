'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Question, QuestionFeedback, Difficulty } from '@/types'
import { generateQuestions, evaluateAnswer } from '@/lib/ai'
import { formatDuration, generateId } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ScoreRing from '@/components/ui/ScoreRing'

type Phase = 'loading' | 'question' | 'evaluating' | 'feedback' | 'done'

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default function SessionPage() {
  const router = useRouter()
  const { currentSession, addSession, user } = useApp()
  const [phase, setPhase] = useState<Phase>('loading')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedbacks, setFeedbacks] = useState<QuestionFeedback[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(150)
  const [isRecording, setIsRecording] = useState(false)
  const [loadError, setLoadError] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const currentQ = questions[currentIdx]
  const isLastQuestion = currentIdx >= questions.length - 1

  // Generate questions on mount
  useEffect(() => {
    async function load() {
      try {
        const qs = await generateQuestions(
          currentSession?.role || 'Software Engineer',
          currentSession?.industry || 'Technology',
          ['behavioral', 'technical', 'general'],
          (currentSession?.difficulty as Difficulty) || 'medium',
          5
        )
        setQuestions(qs)
        setPhase('question')
      } catch {
        setLoadError('Failed to generate questions. Please check your connection and try again.')
        setPhase('question')
        // Fallback questions
        setQuestions([
          { id: 'q1', text: 'Tell me about yourself and why you\'re interested in this role.', type: 'general', hint: 'Keep it to 2 minutes. Focus on relevant experience.', difficulty: 'medium' },
          { id: 'q2', text: 'Describe a challenging project you\'ve worked on and how you overcame obstacles.', type: 'behavioral', hint: 'Use the STAR method: Situation, Task, Action, Result.', difficulty: 'medium' },
          { id: 'q3', text: 'How do you approach learning new technologies or frameworks on the job?', type: 'technical', hint: 'Give a concrete example of something you learned recently.', difficulty: 'medium' },
          { id: 'q4', text: 'Describe a time you disagreed with a team decision. How did you handle it?', type: 'behavioral', hint: 'Show diplomacy and ability to commit even when you disagree.', difficulty: 'medium' },
          { id: 'q5', text: 'Where do you see yourself professionally in 3–5 years?', type: 'general', hint: 'Align your goals with the company\'s growth direction.', difficulty: 'medium' },
        ])
      }
    }
    load()
  }, [currentSession])

  // Timer
  useEffect(() => {
    if (phase !== 'question') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setTimeLeft(150)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, currentIdx])

  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || !currentQ) return
    if (timerRef.current) clearInterval(timerRef.current)
    if (isRecording) stopRecording()

    setPhase('evaluating')
    const savedAnswer = answer

    try {
      const feedback = await evaluateAnswer(
        currentQ,
        savedAnswer,
        currentSession?.role || 'Professional',
        (currentSession?.difficulty as Difficulty) || 'medium'
      )
      setFeedbacks(prev => [...prev, feedback])
      setAnswers(prev => [...prev, savedAnswer])
      setPhase('feedback')
    } catch {
      // Fallback feedback
      const fallback: QuestionFeedback = {
        questionId: currentQ.id,
        score: 70,
        clarity: 68,
        confidence: 72,
        relevance: 70,
        strengths: 'You provided a structured response with relevant examples.',
        improvements: 'Try to be more specific with measurable outcomes.',
        summary: 'Good attempt. Focus on specificity and quantifiable results to strengthen your answer.',
      }
      setFeedbacks(prev => [...prev, fallback])
      setAnswers(prev => [...prev, savedAnswer])
      setPhase('feedback')
    }
  }, [answer, currentQ, currentSession, isRecording])

  function handleNext() {
    if (isLastQuestion) {
      // Save session
      const totalScore = Math.round(feedbacks.reduce((a, f) => a + f.score, 0) / feedbacks.length)
      addSession({
        id: generateId(),
        userId: user?.id || '1',
        role: currentSession?.role || 'Professional',
        industry: currentSession?.industry || 'General',
        interviewType: currentSession?.interviewType || 'general',
        difficulty: (currentSession?.difficulty as Difficulty) || 'medium',
        mode: currentSession?.mode || 'text',
        questions,
        answers: answers.map((text, i) => ({ questionId: questions[i]?.id, text, duration: 150 - timeLeft })),
        feedbacks,
        overallScore: totalScore,
        duration: questions.length * 150,
        completedAt: new Date().toISOString(),
      })
      router.push('/practice/feedback')
    } else {
      setCurrentIdx(i => i + 1)
      setAnswer('')
      setPhase('question')
    }
  }

  function toggleRecording() {
    if (isRecording) { stopRecording(); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.onresult = (e: SpeechRecognitionEvent) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
      setAnswer(t)
    }
    r.onend = () => setIsRecording(false)
    r.start()
    recognitionRef.current = r
    setIsRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const currentFeedback = feedbacks[feedbacks.length - 1]
  const progress = ((currentIdx + (phase === 'feedback' ? 1 : 0)) / questions.length) * 100

  // Loading state
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-cz-bg)' }}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--color-cz-gold)', borderTopColor: 'transparent' }} />
          <p className="font-syne font-600" style={{ color: 'var(--color-cz-text)' }}>Generating your questions...</p>
          <p className="text-sm" style={{ color: 'var(--color-cz-muted)' }}>Tailoring to your role and industry</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cz-bg)' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between"
        style={{ background: 'var(--color-cz-surface)', borderBottom: '1px solid var(--color-cz-border)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/practice')}
            className="text-xs flex items-center gap-1.5 transition-colors"
            style={{ color: 'var(--color-cz-muted)' }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            End
          </button>
          <span className="text-sm font-syne font-600" style={{ color: 'var(--color-cz-text)' }}>
            Q {currentIdx + 1} <span style={{ color: 'var(--color-cz-muted)' }}>of {questions.length}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-8 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-cz-surface2)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-cz-gold), var(--color-cz-gold-light))' }}
          />
        </div>

        {/* Timer */}
        <div
          className="font-syne font-600 text-sm px-3 py-1 rounded-full"
          style={{
            background: timeLeft <= 30 ? 'var(--color-cz-red-dim)' : 'var(--color-cz-surface2)',
            color: timeLeft <= 30 ? 'var(--color-cz-red)' : 'var(--color-cz-muted)',
            border: `1px solid ${timeLeft <= 30 ? 'rgba(192,97,74,0.3)' : 'var(--color-cz-border)'}`,
          }}
        >
          {formatDuration(timeLeft)}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Question card */}
        <div
          className="rounded-[var(--radius-lg)] p-6 mb-6 relative overflow-hidden"
          style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, var(--color-cz-gold), var(--color-cz-gold-light))' }} />
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={currentQ?.type as 'behavioral' | 'technical' | 'general' || 'general'}>
              {currentQ?.type || 'general'}
            </Badge>
            <span className="text-xs capitalize" style={{ color: 'var(--color-cz-muted)' }}>
              {currentSession?.difficulty || 'medium'}
            </span>
          </div>
          <p className="font-syne font-600 text-xl leading-snug" style={{ color: 'var(--color-cz-text)' }}>
            {currentQ?.text || 'Loading question...'}
          </p>
          {currentQ?.hint && (
            <p className="text-xs mt-4 pt-4 leading-relaxed" style={{ color: 'var(--color-cz-muted)', borderTop: '1px solid var(--color-cz-border)' }}>
              💡 {currentQ.hint}
            </p>
          )}
        </div>

        {/* Answer + feedback section */}
        {phase !== 'feedback' ? (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={7}
              placeholder="Type your answer here... Be specific, use examples, and structure your response clearly."
              className="cz-input resize-none mb-4 leading-relaxed"
              disabled={phase === 'evaluating'}
            />

            <div className="flex gap-3">
              {/* Voice button */}
              <button
                onClick={toggleRecording}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border text-sm transition-all"
                style={{
                  background: isRecording ? 'rgba(192,97,74,0.1)' : 'var(--color-cz-surface2)',
                  borderColor: isRecording ? 'rgba(192,97,74,0.4)' : 'var(--color-cz-border)',
                  color: isRecording ? 'var(--color-cz-red)' : 'var(--color-cz-muted)',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: isRecording ? 'var(--color-cz-red)' : 'var(--color-cz-muted)' }}
                />
                {isRecording ? 'Recording...' : 'Voice'}
              </button>

              <Button
                onClick={handleSubmit}
                loading={phase === 'evaluating'}
                disabled={!answer.trim() || phase === 'evaluating'}
                className="flex-1 justify-center"
              >
                {phase === 'evaluating' ? 'Analysing...' : 'Submit Answer →'}
              </Button>
            </div>
          </>
        ) : (
          /* Feedback panel */
          <div className="animate-fade-up space-y-4">
            <div
              className="rounded-[var(--radius-lg)] p-5 relative overflow-hidden"
              style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-cz-gold)' }}>AI Feedback</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-cz-text)' }}>
                    {currentFeedback?.summary}
                  </p>
                </div>
                <ScoreRing score={currentFeedback?.score ?? 0} size={80} strokeWidth={6} />
              </div>

              {/* Dimension bars */}
              <div className="space-y-2.5 mb-4">
                {[
                  { label: 'Clarity', val: currentFeedback?.clarity },
                  { label: 'Confidence', val: currentFeedback?.confidence },
                  { label: 'Relevance', val: currentFeedback?.relevance },
                ].map(dim => (
                  <div key={dim.label} className="flex items-center gap-3">
                    <span className="text-xs w-20 shrink-0" style={{ color: 'var(--color-cz-muted)' }}>{dim.label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-cz-surface2)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${dim.val ?? 0}%`,
                          background: (dim.val ?? 0) >= 75 ? 'var(--color-cz-teal)' : (dim.val ?? 0) >= 55 ? 'var(--color-cz-gold)' : 'var(--color-cz-red)',
                        }}
                      />
                    </div>
                    <span className="text-xs font-syne font-600 w-8 text-right" style={{ color: 'var(--color-cz-muted)' }}>
                      {dim.val}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[var(--radius-md)] p-3" style={{ background: 'rgba(122,173,138,0.08)', border: '1px solid rgba(122,173,138,0.15)' }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-cz-teal)' }}>Strength</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-cz-text)' }}>{currentFeedback?.strengths}</p>
                </div>
                <div className="rounded-[var(--radius-md)] p-3" style={{ background: 'var(--color-cz-gold-dim)', border: '1px solid var(--color-cz-gold-border)' }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-cz-gold)' }}>Improve</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-cz-text)' }}>{currentFeedback?.improvements}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleNext} size="lg" className="w-full justify-center">
              {isLastQuestion ? 'View Full Results →' : `Next Question (${currentIdx + 2}/${questions.length}) →`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}