'use client'
// components/practice/PersonaSelector.tsx
// Drop this into your components/practice/ folder.
// Used in app/practice/page.tsx (the setup/config screen).

import { useState } from 'react'
import { PERSONAS, DIFFICULTY_CONFIG, getAvailablePersonas, type Persona, type PlanTier } from '@/lib/personas'

interface PersonaSelectorProps {
  userPlan: PlanTier
  selectedId: string | null
  onSelect: (persona: Persona) => void
}

export default function PersonaSelector({ userPlan, selectedId, onSelect }: PersonaSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const available = getAvailablePersonas(userPlan)

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--color-cz-muted)', fontSize: '0.875rem' }}>
          Choose who's interviewing you. Each persona changes the question tone, timer, and scoring rubric.
        </p>
        {userPlan === 'free' && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--color-cz-burg-dim)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--color-cz-burg)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <span>✦</span>
            <span>6 more personas unlocked on Pro — including the Mixed Panel and Skeptic</span>
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.75rem',
      }}>
        {PERSONAS.map(persona => {
          const isLocked = persona.plan === 'pro' && userPlan === 'free'
          const isSelected = selectedId === persona.id
          const isHovered = hoveredId === persona.id
          const diffConfig = DIFFICULTY_CONFIG[persona.difficulty]

          return (
            <button
              key={persona.id}
              onClick={() => !isLocked && onSelect(persona)}
              onMouseEnter={() => setHoveredId(persona.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={isLocked}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '10px',
                border: isSelected
                  ? '2px solid var(--color-cz-burg)'
                  : '1px solid var(--color-cz-border2)',
                background: isSelected
                  ? 'var(--color-cz-burg-dim)'
                  : isHovered && !isLocked
                  ? 'var(--color-cz-surface2)'
                  : 'var(--color-cz-surface)',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.55 : 1,
                transition: 'all 0.15s ease',
                transform: isSelected ? 'translateY(-1px)' : 'none',
                boxShadow: isSelected
                  ? '0 4px 16px rgba(64,31,40,0.12)'
                  : 'none',
              }}
            >
              {/* Pro lock badge */}
              {isLocked && (
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  background: 'var(--color-cz-burg)',
                  color: 'var(--color-cz-bg)',
                  letterSpacing: '0.05em',
                }}>PRO</span>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--color-cz-burg)',
                  color: 'var(--color-cz-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                }}>✓</span>
              )}

              {/* Emoji */}
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>
                {persona.emoji}
              </span>

              {/* Name */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-syne)',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-cz-text)',
                marginBottom: '0.2rem',
                lineHeight: 1.3,
              }}>
                {persona.name}
              </span>

              {/* Subtitle */}
              <span style={{
                display: 'block',
                fontSize: '0.75rem',
                color: 'var(--color-cz-muted)',
                marginBottom: '0.6rem',
              }}>
                {persona.subtitle}
              </span>

              {/* Traits */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {persona.traits.map((trait, i) => (
                  <li key={i} style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-cz-muted)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.3rem',
                    marginBottom: '0.15rem',
                  }}>
                    <span style={{ color: 'var(--color-cz-burg)', marginTop: '1px', flexShrink: 0 }}>·</span>
                    {trait}
                  </li>
                ))}
              </ul>

              {/* Footer row: timer + difficulty */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.75rem',
                paddingTop: '0.6rem',
                borderTop: '1px solid var(--color-cz-border)',
              }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--color-cz-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  ⏱ {persona.timerSeconds >= 60
                    ? `${persona.timerSeconds / 60} min`
                    : `${persona.timerSeconds}s`}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: `${diffConfig.color}18`,
                  color: diffConfig.color,
                  letterSpacing: '0.02em',
                }}>
                  {diffConfig.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected persona detail strip */}
      {selectedId && (() => {
        const p = PERSONAS.find(x => x.id === selectedId)
        if (!p) return null
        return (
          <div style={{
            marginTop: '1rem',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            background: 'var(--color-cz-surface2)',
            border: '1px solid var(--color-cz-border2)',
            fontSize: '0.8rem',
            color: 'var(--color-cz-muted)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{p.emoji}</span>
            <div>
              <span style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 600,
                color: 'var(--color-cz-text)',
                fontSize: '0.825rem',
              }}>
                {p.name}
              </span>
              <span style={{ marginLeft: '0.5rem' }}>{p.description}</span>
            </div>
          </div>
        )
      })()}
    </div>
  )
}