'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { InterviewType, Difficulty, PracticeMode } from '@/types'
import { ROLES, INDUSTRIES, cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

type Step = 'mode' | 'config'

const modes: { id: PracticeMode; icon: string; title: string; desc: string; time: string; features: string[]; premium?: boolean }[] = [
  {
    id: 'text',
    icon: '⌨️',
    title: 'Text Practice',
    desc: 'Classic Q&A. Type your answers, get instant AI feedback.',
    time: '15–30 min',
    features: ['AI question generation', 'Instant scoring', 'Answer feedback', 'Voice input supported'],
  },
  {
    id: 'video',
    icon: '🎥',
    title: 'Video Mock',
    desc: 'Full simulation with your camera. See yourself while you answer.',
    time: '30–45 min',
    features: ['Live transcript', 'Filler word detection', 'Eye contact feedback', 'Video playback'],
    premium: true,
  },
]

const interviewTypes: { id: InterviewType; label: string; emoji: string; desc: string }[] = [
  { id: 'behavioral', label: 'Behavioral', emoji: '🗣️', desc: 'Past experiences, soft skills' },
  { id: 'technical', label: 'Technical', emoji: '💻', desc: 'Role-specific knowledge' },
  { id: 'general', label: 'General', emoji: '📋', desc: 'Culture fit, motivations' },
  { id: 'case-study', label: 'Case Study', emoji: '🔍', desc: 'Problem-solving scenarios' },
]

const difficulties: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Entry level' },
  { id: 'medium', label: 'Medium', desc: 'Mid-level' },
  { id: 'hard', label: 'Hard', desc: 'Senior+' },
]

export default function PracticePage() {
  const router = useRouter()
  const { user, setCurrentSession } = useApp()
  const [step, setStep] = useState<Step>('mode')
  const [mode, setMode] = useState<PracticeMode>('text')
  const [selectedTypes, setSelectedTypes] = useState<InterviewType[]>(['behavioral', 'general'])
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [role, setRole] = useState(user?.targetRole || '')
  const [industry, setIndustry] = useState(user?.industry || '')
  const [questionCount, setQuestionCount] = useState(5)
  const [jd, setJd] = useState('')
  const [showJd, setShowJd] = useState(false)

  function toggleType(type: InterviewType) {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.length > 1 ? prev.filter(t => t !== type) : prev
        : [...prev, type]
    )
  }

  function handleStart() {
    setCurrentSession({
      mode,
      role,
      industry,
      difficulty,
      interviewType: selectedTypes[0],
    })
    router.push('/practice/session')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-syne font-700 text-2xl tracking-tight" style={{ color: 'var(--color-cz-text)' }}>
          {step === 'mode' ? 'Choose Practice Mode' : 'Configure Your Session'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-cz-muted)' }}>
          {step === 'mode'
            ? 'Select how you want to practice today.'
            : 'Tailor the questions to your exact needs.'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(['mode', 'config'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-syne font-600 transition-all"
              style={{
                background: step === s || (s === 'mode' && step === 'config') ? 'var(--color-cz-gold)' : 'var(--color-cz-surface2)',
                color: step === s || (s === 'mode' && step === 'config') ? '#1a1910' : 'var(--color-cz-muted)',
              }}
            >
              {s === 'mode' && step === 'config' ? '✓' : i + 1}
            </div>
            <span
              className="text-sm capitalize"
              style={{ color: step === s ? 'var(--color-cz-text)' : 'var(--color-cz-muted)' }}
            >
              {s === 'mode' ? 'Mode' : 'Configure'}
            </span>
            {i === 0 && <div className="w-8 h-px mx-1" style={{ background: 'var(--color-cz-border2)' }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Mode selection */}
      {step === 'mode' && (
        <div className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => !m.premium && setMode(m.id)}
                className="text-left rounded-[var(--radius-lg)] p-6 transition-all duration-200 relative overflow-hidden group"
                style={{
                  background: mode === m.id ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-surface)',
                  border: `1px solid ${mode === m.id ? 'var(--color-cz-gold-border)' : 'var(--color-cz-border)'}`,
                  opacity: m.premium ? 0.7 : 1,
                  cursor: m.premium ? 'not-allowed' : 'pointer',
                }}
              >
                {m.premium && (
                  <span
                    className="absolute top-3 right-3 text-[10px] font-syne font-600 px-2 py-0.5 rounded-full border"
                    style={{ background: 'var(--color-cz-gold-dim)', color: 'var(--color-cz-gold)', borderColor: 'var(--color-cz-gold-border)' }}
                  >
                    PRO
                  </span>
                )}
                <div className="text-3xl mb-4">{m.icon}</div>
                <h3 className="font-syne font-600 text-lg mb-1.5" style={{ color: mode === m.id ? 'var(--color-cz-gold-light)' : 'var(--color-cz-text)' }}>
                  {m.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-cz-muted)' }}>{m.desc}</p>
                <div className="flex items-center gap-1.5 mb-4">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-cz-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>{m.time}</span>
                </div>
                <ul className="space-y-1.5">
                  {m.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-cz-muted)' }}>
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: 'var(--color-cz-teal)', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => setStep('config')} size="lg">
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 'config' && (
        <div className="space-y-6 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Target Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="cz-input">
                <option value="">Select role...</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Industry</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} className="cz-input">
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Question types */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-2.5 block" style={{ color: 'var(--color-cz-muted)' }}>
              Question Types <span className="normal-case opacity-60">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {interviewTypes.map(t => {
                const active = selectedTypes.includes(t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleType(t.id)}
                    className="flex flex-col items-start gap-1 p-3 rounded-[var(--radius-md)] border text-left transition-all duration-150"
                    style={{
                      background: active ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-surface2)',
                      borderColor: active ? 'var(--color-cz-gold-border)' : 'var(--color-cz-border)',
                    }}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className="text-xs font-syne font-600" style={{ color: active ? 'var(--color-cz-gold-light)' : 'var(--color-cz-text)' }}>
                      {t.label}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-cz-muted)' }}>{t.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-2.5 block" style={{ color: 'var(--color-cz-muted)' }}>Difficulty</label>
            <div className="flex gap-2.5">
              {difficulties.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className="flex-1 py-2.5 rounded-[var(--radius-md)] border text-sm font-syne font-600 transition-all"
                  style={{
                    background: difficulty === d.id ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-surface2)',
                    borderColor: difficulty === d.id ? 'var(--color-cz-gold-border)' : 'var(--color-cz-border)',
                    color: difficulty === d.id ? 'var(--color-cz-gold-light)' : 'var(--color-cz-muted)',
                  }}
                >
                  {d.label}
                  <span className="block text-[10px] font-dm font-normal mt-0.5" style={{ color: 'var(--color-cz-subtle)' }}>
                    {d.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Question count slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>
                Number of Questions
              </label>
              <span className="font-syne font-600 text-sm" style={{ color: 'var(--color-cz-gold-light)' }}>{questionCount}</span>
            </div>
            <input
              type="range" min={3} max={10} step={1}
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none outline-none cursor-pointer"
              style={{ accentColor: 'var(--color-cz-gold)', background: 'var(--color-cz-surface3)' }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--color-cz-subtle)' }}>
              <span>3 (quick)</span><span>10 (full)</span>
            </div>
          </div>

          {/* Job description paste */}
          <div>
            <button
              onClick={() => setShowJd(p => !p)}
              className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-cz-text)]"
              style={{ color: 'var(--color-cz-gold)' }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={showJd ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'} />
              </svg>
              {showJd ? 'Hide' : 'Add'} job description (optional)
            </button>
            {showJd && (
              <div className="mt-3 animate-fade-up">
                <textarea
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  rows={5}
                  placeholder="Paste the job description here. AI will extract skills and requirements to generate more targeted questions..."
                  className="cz-input resize-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setStep('mode')}>
              ← Back
            </Button>
            <Button
              onClick={handleStart}
              disabled={!role || !industry}
              size="lg"
              className="flex-1 justify-center"
            >
              Start Interview →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}