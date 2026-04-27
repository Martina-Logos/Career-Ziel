'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const slides = [
  {
    title: 'Practice with AI mocks',
    desc: 'Answer real interview questions tailored to your role and industry. Text or voice — your choice.',
    color: 'var(--color-cz-gold)',
    bg: 'var(--color-cz-gold-dim)',
  },
  {
    title: 'Get instant feedback',
    desc: 'Every answer is scored on clarity, confidence, relevance and accuracy. Know exactly where you stand.',
    color: 'var(--color-cz-teal)',
    bg: 'var(--color-cz-teal-dim)',
  },
  {
    title: 'Track your progress',
    desc: 'Session scores, skill heatmaps, and trend charts show your improvement over time.',
    color: '#7aad8a',
    bg: 'rgba(122, 173, 138, 0.12)',
  },
  {
    title: 'Personalize every session',
    desc: 'Paste a job description and get questions crafted directly from the role requirements.',
    color: 'var(--color-cz-gold-light)',
    bg: 'var(--color-cz-gold-dim)',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const slide = slides[current]
  const isLast = current === slides.length - 1

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-cz-bg)' }}>
      <div className="w-full max-w-md">
        {/* Skip */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => router.push('/profile-setup')}
            className="text-sm text-[var(--color-cz-muted)] hover:text-[var(--color-cz-text)] transition-colors"
          >
            Skip →
          </button>
        </div>

        {/* Slide */}
        <div
          key={current}
          className="glass-card p-10 text-center animate-fade-up relative overflow-hidden"
          style={{ borderColor: `${slide.color}22` }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[var(--radius-lg)]"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${slide.bg} 0%, transparent 70%)` }}
          />

          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-7 relative z-10"
            style={{ background: slide.bg, border: `1px solid ${slide.color}30` }}
          >
            {slide.emoji}
          </div>

          <h2
            className="font-syne font-700 text-2xl tracking-tight mb-3 relative z-10"
            style={{ color: slide.color }}
          >
            {slide.title}
          </h2>
          <p className="text-[var(--color-cz-muted)] text-base leading-relaxed relative z-10">
            {slide.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 my-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? slide.color : 'var(--color-cz-surface3)',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={() => setCurrent(c => c - 1)}
              className="cz-btn cz-btn-secondary flex-1"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => isLast ? router.push('/profile-setup') : setCurrent(c => c + 1)}
            className="cz-btn cz-btn-primary flex-1"
          >
            {isLast ? 'Set Up Profile →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}