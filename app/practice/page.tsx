'use client'
// app/practice/page.tsx
// Single-step setup: pick persona → configure role/difficulty → start.
// No "mode" step. Free users see all personas but Pro ones show upgrade modal.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PERSONAS, DIFFICULTY_CONFIG, type Persona } from '@/lib/personas'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

const ROLES = [
  'Software Engineer', 'Product Manager', 'Data Scientist', 'Data Analyst',
  'UX / Product Designer', 'Marketing Manager', 'Business Analyst',
  'DevOps / Platform Engineer', 'Engineering Manager', 'Other',
]

const QUESTION_TYPES = [
  { id: 'technical',  label: 'Technical',  emoji: '💻' },
  { id: 'behavioral', label: 'Behavioral', emoji: '🗣️' },
  { id: 'general',    label: 'General',    emoji: '📋' },
]

export default function PracticePage() {
  const router = useRouter()
  const { user, loading } = useUser()

  const userPlan = user?.plan ?? 'free'

  const [selectedPersona, setSelectedPersona]     = useState<Persona | null>(null)
  const [lockedPersona, setLockedPersona]         = useState<Persona | null>(null) // for pro modal
  const [role, setRole]                           = useState(user?.target_role ?? '')
  const [difficulty, setDifficulty]               = useState<'junior' | 'mid' | 'senior'>('mid')
  const [selectedTypes, setSelectedTypes]         = useState<string[]>(['technical', 'behavioral', 'general'])

  function toggleType(id: string) {
    setSelectedTypes(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(t => t !== id) : prev
        : [...prev, id]
    )
  }

  function handlePersonaClick(persona: Persona) {
    if (persona.plan === 'pro' && userPlan === 'free') {
      setLockedPersona(persona)
    } else {
      setSelectedPersona(persona)
      setLockedPersona(null)
    }
  }

  function handleStart() {
    if (!selectedPersona || !role) return
    const params = new URLSearchParams({
      persona:    selectedPersona.id,
      role,
      difficulty,
      types:      selectedTypes.join(','),
    })
    router.push(`/practice/session?${params.toString()}`)
  }

  const canStart = !!selectedPersona && !!role && selectedTypes.length > 0

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-cz-text)', margin: '0 0 0.25rem' }}>
          Start a session
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-cz-muted)' }}>
          Choose your interviewer, configure your session, and practise.
        </p>
      </div>

      {/* ── Section 1: Persona picker ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-cz-text)', margin: 0 }}>
            Choose your interviewer
          </h2>
          {userPlan === 'free' && (
            <Link href="/pricing" style={{ fontSize: '0.775rem', color: 'var(--color-cz-burg)', fontWeight: 600, textDecoration: 'none' }}>
              Unlock all 9 personas →
            </Link>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
          {PERSONAS.map(persona => {
            const isLocked   = persona.plan === 'pro' && userPlan === 'free'
            const isSelected = selectedPersona?.id === persona.id
            const diff       = DIFFICULTY_CONFIG[persona.difficulty]

            return (
              <button
                key={persona.id}
                onClick={() => handlePersonaClick(persona)}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  padding: '1rem',
                  borderRadius: 10,
                  border: isSelected
                    ? '2px solid var(--color-cz-burg)'
                    : '1px solid var(--color-cz-border2)',
                  background: isSelected
                    ? 'var(--color-cz-burg-dim)'
                    : 'var(--color-cz-surface)',
                  cursor: 'pointer',
                  opacity: isLocked ? 0.7 : 1,
                  transition: 'all 0.15s',
                  transform: isSelected ? 'translateY(-1px)' : 'none',
                  boxShadow: isSelected ? '0 4px 16px rgba(64,31,40,0.12)' : 'none',
                }}
              >
                {/* Lock badge */}
                {isLocked && (
                  <span style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    fontSize: '0.6rem', fontWeight: 700,
                    padding: '0.15rem 0.45rem', borderRadius: 4,
                    background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)',
                    letterSpacing: '0.05em',
                  }}>PRO</span>
                )}

                {/* Check */}
                {isSelected && (
                  <span style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem',
                  }}>✓</span>
                )}

                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>{persona.emoji}</span>

                <span style={{ display: 'block', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.825rem', color: 'var(--color-cz-text)', marginBottom: '0.2rem', lineHeight: 1.3 }}>
                  {persona.name}
                </span>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--color-cz-muted)', marginBottom: '0.6rem' }}>
                  {persona.subtitle}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--color-cz-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-cz-muted)' }}>
                    ⏱ {persona.timerSeconds >= 60 ? `${persona.timerSeconds / 60}min` : `${persona.timerSeconds}s`}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: 4, background: `${diff.color}18`, color: diff.color }}>
                    {diff.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected persona description strip */}
        {selectedPersona && (
          <div style={{ marginTop: '0.875rem', padding: '0.875rem 1rem', borderRadius: 8, background: 'var(--color-cz-surface2)', border: '1px solid var(--color-cz-border2)', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{selectedPersona.emoji}</span>
            <div>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.825rem', color: 'var(--color-cz-text)' }}>
                {selectedPersona.name}
              </span>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--color-cz-muted)' }}>
                {selectedPersona.description}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 2: Session config ── */}
      <div style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-cz-text)', margin: '0 0 1.25rem' }}>
          Configure session
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Role */}
          <div>
            <label style={lbl}>Target role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={input}>
              <option value="">Select role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={lbl}>Difficulty</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['junior', 'mid', 'senior'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1, padding: '0.6rem 0.25rem', borderRadius: 7,
                    border: difficulty === d ? '1px solid var(--color-cz-burg)' : '1px solid var(--color-cz-border2)',
                    background: difficulty === d ? 'var(--color-cz-burg-dim)' : 'var(--color-cz-surface2)',
                    color: difficulty === d ? 'var(--color-cz-burg)' : 'var(--color-cz-muted)',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >
                  {d === 'mid' ? 'Mid' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question types */}
        <div>
          <label style={lbl}>Question types</label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {QUESTION_TYPES.map(t => {
              const active = selectedTypes.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleType(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 0.875rem', borderRadius: 20,
                    border: active ? '1px solid var(--color-cz-burg)' : '1px solid var(--color-cz-border2)',
                    background: active ? 'var(--color-cz-burg-dim)' : 'var(--color-cz-surface2)',
                    color: active ? 'var(--color-cz-burg)' : 'var(--color-cz-muted)',
                    fontSize: '0.825rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
                  }}
                >
                  <span>{t.emoji}</span> {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Start button ── */}
      <button
        onClick={handleStart}
        disabled={!canStart}
        style={{
          width: '100%', padding: '0.9rem',
          borderRadius: 10, border: 'none',
          background: canStart ? 'var(--color-cz-burg)' : 'var(--color-cz-surface3)',
          color: canStart ? 'var(--color-cz-bg)' : 'var(--color-cz-muted)',
          fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem',
          cursor: canStart ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {!selectedPersona ? 'Select an interviewer to continue' : !role ? 'Select a role to continue' : 'Start interview →'}
      </button>

      {/* ── Pro upgrade modal ── */}
      {lockedPersona && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={() => setLockedPersona(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-cz-surface)',
              border: '1px solid var(--color-cz-border2)',
              borderRadius: 16, padding: '2rem',
              maxWidth: 420, width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{lockedPersona.emoji}</div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: 20, background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.875rem', letterSpacing: '0.05em' }}>
              PRO PERSONA
            </div>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-cz-text)', margin: '0 0 0.5rem' }}>
              {lockedPersona.name}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-cz-muted)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
              {lockedPersona.description}
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {lockedPersona.traits.map((t, i) => (
                <span key={i} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 20, background: 'var(--color-cz-surface2)', color: 'var(--color-cz-muted)', border: '1px solid var(--color-cz-border)' }}>
                  {t}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-cz-muted)', margin: '0 0 1.25rem' }}>
              Upgrade to Pro to unlock all 9 personas, advanced analytics, and the job description extractor.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setLockedPersona(null)}
                style={{ flex: 1, padding: '0.7rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface)', color: 'var(--color-cz-text)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Maybe later
              </button>
              <Link
                href="/pricing"
                style={{ flex: 1, padding: '0.7rem', borderRadius: 8, background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Upgrade to Pro →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cz-text)', marginBottom: '0.5rem' }
const input: React.CSSProperties = { width: '100%', padding: '0.65rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface2)', color: 'var(--color-cz-text)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }