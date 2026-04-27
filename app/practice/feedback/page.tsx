'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getScoreLabel, getGradeLetter, formatDate, formatDuration } from '@/lib/utils'
import ScoreRing from '@/components/ui/ScoreRing'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function FeedbackPage() {
  const { sessions } = useApp()
  const router = useRouter()
  const session = sessions[0] // Most recent

  // Fallback mock if no session yet
  const data = session || {
    role: 'Software Engineer',
    industry: 'Technology',
    overallScore: 78,
    duration: 1500,
    completedAt: new Date().toISOString(),
    questions: [
      { id: 'q1', text: 'Tell me about yourself.', type: 'general' },
      { id: 'q2', text: 'Describe a challenging project.', type: 'behavioral' },
      { id: 'q3', text: 'How do you approach learning new tech?', type: 'technical' },
    ],
    answers: [
      { questionId: 'q1', text: 'I am a software developer with 4 years of experience...' },
      { questionId: 'q2', text: 'In my last role, we had to migrate a monolith to microservices...' },
      { questionId: 'q3', text: 'I typically start with the official documentation and build a small project...' },
    ],
    feedbacks: [
      { questionId: 'q1', score: 76, clarity: 74, confidence: 78, relevance: 76, strengths: 'Well structured introduction', improvements: 'Add more specifics about impact', summary: 'Good overview but could be more targeted.' },
      { questionId: 'q2', score: 82, clarity: 80, confidence: 84, relevance: 82, strengths: 'Strong STAR format usage', improvements: 'Quantify the results more clearly', summary: 'Excellent behavioral answer with clear structure.' },
      { questionId: 'q3', score: 71, clarity: 70, confidence: 72, relevance: 71, strengths: 'Practical, experience-based approach', improvements: 'Mention a specific recent technology you learned', summary: 'Decent answer, needs a concrete example.' },
    ],
  }

  const avgScore = data.overallScore
  const scores = data.feedbacks.map((f: { score: number }) => f.score)
  const best = Math.max(...scores)
  const worst = Math.min(...scores)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cz-bg)' }}>
      {/* Top bar */}
      <div
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ background: 'var(--color-cz-surface)', borderBottom: '1px solid var(--color-cz-border)' }}
      >
        <span className="font-syne font-600 text-base" style={{ color: 'var(--color-cz-text)' }}>Session Results</span>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">← Dashboard</Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Hero score card */}
        <div
          className="rounded-[var(--radius-xl)] p-8 text-center relative overflow-hidden animate-fade-up"
          style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--color-cz-gold-dim), transparent 65%)' }} />
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, var(--color-cz-gold), var(--color-cz-gold-light))' }} />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-cz-gold)' }}>
              {data.role} · {formatDate(data.completedAt)}
            </p>
            <div className="flex justify-center mb-4">
              <ScoreRing score={avgScore} size={140} strokeWidth={10} label={getScoreLabel(avgScore)} />
            </div>
            <div
              className="inline-block px-4 py-1.5 rounded-full font-syne font-600 text-sm border"
              style={{
                background: avgScore >= 80 ? 'rgba(122,173,138,0.12)' : avgScore >= 65 ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-red-dim)',
                color: avgScore >= 80 ? 'var(--color-cz-teal)' : avgScore >= 65 ? 'var(--color-cz-gold-light)' : 'var(--color-cz-red)',
                borderColor: avgScore >= 80 ? 'rgba(122,173,138,0.25)' : avgScore >= 65 ? 'var(--color-cz-gold-border)' : 'rgba(192,97,74,0.3)',
              }}
            >
              Grade {getGradeLetter(avgScore)} — {getScoreLabel(avgScore)}
            </div>
          </div>
        </div>

        {/* Metric row */}
        <div className="grid grid-cols-3 gap-4 animate-fade-up stagger-2">
          {[
            { label: 'Avg. Score', value: `${avgScore}%`, color: 'var(--color-cz-gold-light)' },
            { label: 'Best Answer', value: `${best}%`, color: 'var(--color-cz-teal)' },
            { label: 'Needs Work', value: `${worst}%`, color: 'var(--color-cz-muted)' },
          ].map((m, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-lg)] p-4 text-center"
              style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
            >
              <p className="font-syne font-700 text-xl" style={{ color: m.color }}>{m.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-cz-muted)' }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Skill breakdown */}
        <div
          className="rounded-[var(--radius-lg)] p-5 animate-fade-up stagger-3"
          style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
        >
          <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-cz-muted)' }}>Skill Breakdown</p>
          {[
            { label: 'Clarity', avg: Math.round(data.feedbacks.reduce((a: number, f: { clarity: number }) => a + f.clarity, 0) / data.feedbacks.length) },
            { label: 'Confidence', avg: Math.round(data.feedbacks.reduce((a: number, f: { confidence: number }) => a + f.confidence, 0) / data.feedbacks.length) },
            { label: 'Relevance', avg: Math.round(data.feedbacks.reduce((a: number, f: { relevance: number }) => a + f.relevance, 0) / data.feedbacks.length) },
          ].map(skill => (
            <div key={skill.label} className="flex items-center gap-4 mb-3">
              <span className="text-sm w-24 shrink-0" style={{ color: 'var(--color-cz-text)' }}>{skill.label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-cz-surface2)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.avg}%`,
                    background: skill.avg >= 75 ? 'var(--color-cz-teal)' : skill.avg >= 55 ? 'var(--color-cz-gold)' : 'var(--color-cz-red)',
                    transition: 'width 1s ease 0.5s',
                  }}
                />
              </div>
              <span className="font-syne font-600 text-sm w-8 text-right" style={{ color: 'var(--color-cz-muted)' }}>
                {skill.avg}%
              </span>
            </div>
          ))}
        </div>

        {/* Q&A Breakdown */}
        <div className="animate-fade-up stagger-4">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--color-cz-muted)' }}>
            Question by Question
          </p>
          <div className="space-y-3">
            {data.questions.map((q: { id: string; text: string; type: string }, i: number) => {
              const fb = data.feedbacks[i]
              const ans = data.answers[i]
              return (
                <div
                  key={q.id}
                  className="rounded-[var(--radius-lg)] p-5"
                  style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={q.type as 'behavioral' | 'technical' | 'general'}>{q.type}</Badge>
                        <span className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>Q{i + 1}</span>
                      </div>
                      <p className="text-sm font-medium leading-snug" style={{ color: 'var(--color-cz-text)' }}>{q.text}</p>
                    </div>
                    <div
                      className="font-syne font-700 text-lg shrink-0"
                      style={{
                        color: fb?.score >= 80 ? 'var(--color-cz-teal)' : fb?.score >= 60 ? 'var(--color-cz-gold)' : 'var(--color-cz-red)',
                      }}
                    >
                      {fb?.score ?? '—'}%
                    </div>
                  </div>
                  {ans?.text && (
                    <p className="text-xs mb-3 leading-relaxed line-clamp-2" style={{ color: 'var(--color-cz-muted)' }}>
                      {ans.text}
                    </p>
                  )}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-cz-surface2)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${fb?.score ?? 0}%`,
                        background: (fb?.score ?? 0) >= 80 ? 'var(--color-cz-teal)' : (fb?.score ?? 0) >= 60 ? 'var(--color-cz-gold)' : 'var(--color-cz-red)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pb-10 animate-fade-up stagger-5">
          <Button variant="secondary" onClick={() => router.push('/practice')} className="flex-1 justify-center">
            Practice Again
          </Button>
          <Button onClick={() => router.push('/analytics')} className="flex-1 justify-center">
            View Analytics →
          </Button>
        </div>
      </div>
    </div>
  )
}