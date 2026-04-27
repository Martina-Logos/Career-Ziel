'use client'

import Link from 'next/link'
import { useApp, MOCK_USER } from '@/context/AppContext'
import { useEffect } from 'react'
import { formatDate, getScoreColor, getScoreLabel } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const MOCK_SESSIONS = [
  { id: '1', role: 'Software Engineer', type: 'technical', score: 82, completedAt: '2026-04-23T10:00:00Z', duration: 1800 },
  { id: '2', role: 'Product Manager', type: 'behavioral', score: 74, completedAt: '2026-04-21T14:30:00Z', duration: 1320 },
  { id: '3', role: 'Software Engineer', type: 'general', score: 68, completedAt: '2026-04-19T09:15:00Z', duration: 900 },
]

const quickActions = [
  {
    href: '/practice',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Start New Mock',
    desc: 'Begin an AI practice session',
    primary: true,
  },
  {
    href: '/practice?tab=jd',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    label: 'Upload Job Description',
    desc: 'Get role-specific questions',
    primary: false,
  },
  {
    href: '/analytics',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: 'View Progress Report',
    desc: 'Trends, scores, skill gaps',
    primary: false,
  },
]

export default function DashboardPage() {
  const { user, setUser, sessions } = useApp()

  // Auto-login with mock for dev
  useEffect(() => {
    if (!user) setUser(MOCK_USER)
  }, [user, setUser])

  const displaySessions = sessions.length > 0
    ? sessions.slice(0, 5)
    : MOCK_SESSIONS

  const avgScore = displaySessions.length
    ? Math.round(displaySessions.reduce((a, s) => a + s.score, 0) / displaySessions.length)
    : 0

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Welcome banner */}
      <div className="mb-8 animate-fade-up stagger-1">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-cz-gold)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-syne font-700 text-3xl tracking-tight" style={{ color: 'var(--color-cz-text)' }}>
          Ready for your next session,{' '}
          <span style={{ color: 'var(--color-cz-gold-light)' }}>
            {user?.name?.split(' ')[0] || 'there'}
          </span>
          ?
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-cz-muted)' }}>
          {user?.targetRole ? `Practicing for: ${user.targetRole}` : 'Set a target role to get personalized questions.'}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up stagger-2">
        {[
          { label: 'Sessions', value: user?.totalSessions ?? 12, suffix: '' },
          { label: 'Avg. Score', value: avgScore || 74, suffix: '%' },
          { label: 'Day Streak', value: user?.streak ?? 4, suffix: '🔥' },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-lg)] p-4 text-center"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p
              className="font-syne font-700 text-2xl"
              style={{ color: i === 1 ? 'var(--color-cz-gold-light)' : 'var(--color-cz-text)' }}
            >
              {stat.value}{stat.suffix}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-cz-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8 animate-fade-up stagger-3">
        <h2 className="font-syne font-600 text-base mb-3" style={{ color: 'var(--color-cz-text)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="rounded-[var(--radius-lg)] p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 group relative overflow-hidden"
              style={{
                background: action.primary ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-surface)',
                border: `1px solid ${action.primary ? 'var(--color-cz-gold-border)' : 'var(--color-cz-border)'}`,
              }}
            >
              {action.primary && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'radial-gradient(ellipse at 30% 50%, var(--color-cz-gold-dim), transparent 70%)' }}
                />
              )}
              <span
                className="transition-colors"
                style={{ color: action.primary ? 'var(--color-cz-gold-light)' : 'var(--color-cz-muted)' }}
              >
                {action.icon}
              </span>
              <div>
                <p
                  className="font-syne font-600 text-sm mb-0.5"
                  style={{ color: action.primary ? 'var(--color-cz-gold-light)' : 'var(--color-cz-text)' }}
                >
                  {action.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up stagger-4">
        {/* Recent sessions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-syne font-600 text-base" style={{ color: 'var(--color-cz-text)' }}>Recent Sessions</h2>
            <Link href="/analytics" className="text-xs hover:underline" style={{ color: 'var(--color-cz-gold)' }}>
              View all →
            </Link>
          </div>
          <div
            className="rounded-[var(--radius-lg)] overflow-hidden"
            style={{ border: '1px solid var(--color-cz-border)', background: 'var(--color-cz-surface)' }}
          >
            {displaySessions.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[var(--color-cz-surface2)]"
                style={{
                  borderBottom: i < displaySessions.length - 1 ? '1px solid var(--color-cz-border)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-sm"
                    style={{ background: 'var(--color-cz-surface2)', color: 'var(--color-cz-muted)' }}
                  >
                    {s.type === 'technical' ? '💻' : s.type === 'behavioral' ? '🗣️' : '📋'}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-cz-text)' }}>{s.role}</p>
                    <p className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>
                      {formatDate(s.completedAt)} · {Math.round(s.duration / 60)}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={s.type as 'technical' | 'behavioral' | 'general'}>{s.type}</Badge>
                  <span
                    className="font-syne font-600 text-sm"
                    style={{
                      color: s.score >= 80 ? 'var(--color-cz-teal)' :
                             s.score >= 60 ? 'var(--color-cz-gold)' :
                             'var(--color-cz-red)',
                    }}
                  >
                    {s.score}%
                  </span>
                </div>
              </div>
            ))}

            {displaySessions.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-sm" style={{ color: 'var(--color-cz-muted)' }}>No sessions yet. Start practicing!</p>
                <Link href="/practice" className="cz-btn cz-btn-primary mt-4 text-sm">
                  Start First Session →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Streak card */}
          <div
            className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--color-cz-muted)' }}>Your Streak</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-syne font-700 text-2xl" style={{ color: 'var(--color-cz-gold-light)' }}>
                  {user?.streak ?? 4} days
                </p>
                <p className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>Keep it going!</p>
              </div>
            </div>
            {/* Week dots */}
            <div className="flex gap-1.5">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium"
                    style={{
                      background: i < (user?.streak ?? 4) ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-surface2)',
                      border: `1px solid ${i < (user?.streak ?? 4) ? 'var(--color-cz-gold-border)' : 'var(--color-cz-border)'}`,
                      color: i < (user?.streak ?? 4) ? 'var(--color-cz-gold-light)' : 'var(--color-cz-subtle)',
                    }}
                  >
                    {i < (user?.streak ?? 4) ? '✓' : d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Free tier banner */}
          {user?.tier === 'free' && (
            <div
              className="rounded-[var(--radius-lg)] p-5 relative overflow-hidden"
              style={{ background: 'var(--color-cz-gold-dim)', border: '1px solid var(--color-cz-gold-border)' }}
            >
              <p className="font-syne font-600 text-sm mb-1" style={{ color: 'var(--color-cz-gold-light)' }}>
                Upgrade to Pro
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--color-cz-muted)' }}>
                Unlimited sessions, PDF reports & video playback.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--color-cz-muted)' }}>
                  From $4.99/mo
                </span>
                <Link
                  href="/pricing"
                  className="text-xs font-syne font-600 px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors"
                  style={{ background: 'var(--color-cz-gold)', color: '#1a1910' }}
                >
                  Upgrade →
                </Link>
              </div>
            </div>
          )}

          {/* Tip of the day */}
          <div
            className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-cz-muted)' }}>
              Interview Tip
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-cz-text)' }}>
              Use the STAR method for behavioral questions: <span style={{ color: 'var(--color-cz-gold)' }}>Situation, Task, Action, Result.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}