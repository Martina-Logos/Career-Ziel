'use client'
// app/dashboard/page.tsx
// All data comes from Supabase — no mock arrays, no hardcoded names.
// Shows empty states when user has no sessions yet.

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { useDashboard } from '@/hooks/useDashboard'
import { PERSONAS } from '@/lib/personas'

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number | null) {
  if (score === null) return 'var(--color-cz-muted)'
  if (score >= 80) return '#4A7A5A'
  if (score >= 60) return '#A0622A'
  return '#8B3535'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function personaName(id: string) {
  return PERSONAS.find(p => p.id === id)?.name ?? id
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: boolean
}) {
  return (
    <div style={{
      background: 'var(--color-cz-surface)',
      border: `1px solid ${accent ? 'var(--color-cz-burg-border)' : 'var(--color-cz-border)'}`,
      borderRadius: 12,
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, var(--color-cz-burg), var(--color-cz-blue-dark))',
        }}/>
      )}
      <p style={{ margin: '0 0 0.35rem', fontSize: '0.775rem', color: 'var(--color-cz-muted)', fontWeight: 500 }}>
        {label}
      </p>
      <p style={{
        margin: '0 0 0.2rem',
        fontSize: '1.75rem',
        fontWeight: 700,
        fontFamily: 'var(--font-syne)',
        color: accent ? 'var(--color-cz-burg)' : 'var(--color-cz-text)',
        lineHeight: 1,
      }}>
        {value}
      </p>
      {sub && (
        <p style={{ margin: 0, fontSize: '0.725rem', color: 'var(--color-cz-subtle)' }}>{sub}</p>
      )}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ height = 80, radius = 10 }: { height?: number; radius?: number }) {
  return (
    <div style={{
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, var(--color-cz-surface2) 25%, var(--color-cz-surface3) 50%, var(--color-cz-surface2) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}/>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const { stats, recentSessions, skillBreakdown, loading: dataLoading } = useDashboard()

  const loading = userLoading || dataLoading

  // Greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? ''

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        {loading ? (
          <Skeleton height={28} radius={6} />
        ) : (
          <>
            <h1 style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '1.5rem',
              color: 'var(--color-cz-text)',
              margin: '0 0 0.25rem',
            }}>
              {greeting}{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-cz-muted)' }}>
              {stats?.totalSessions === 0
                ? "You haven't practised yet — start your first session below."
                : `You've completed ${stats?.totalSessions} session${stats?.totalSessions === 1 ? '' : 's'}. Keep going!`
              }
            </p>
          </>
        )}
      </div>

      {/* ── Stats grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {loading ? (
          [1,2,3,4].map(i => <Skeleton key={i} height={100} radius={12} />)
        ) : (
          <>
            <StatCard
              label="Sessions completed"
              value={stats?.totalSessions ?? 0}
              sub="all time"
              accent
            />
            <StatCard
              label="Average score"
              value={stats?.avgScore !== null && stats?.avgScore !== undefined ? `${stats.avgScore}%` : '—'}
              sub="across all sessions"
            />
            <StatCard
              label="Current streak"
              value={`${stats?.currentStreak ?? 0} 🔥`}
              sub="consecutive days"
            />
            <StatCard
              label="Best score"
              value={stats?.bestScore !== null && stats?.bestScore !== undefined ? `${stats.bestScore}%` : '—'}
              sub="personal best"
            />
          </>
        )}
      </div>

      {/* ── Quick action ── */}
      <div style={{
        background: 'var(--color-cz-burg)',
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-cz-bg)' }}>
            Ready to practise?
          </p>
          <p style={{ margin: 0, fontSize: '0.825rem', color: 'rgba(233,226,218,0.75)' }}>
            {user?.target_role
              ? `Pick a persona and start a ${user.target_role} session`
              : 'Choose a role and persona to get started'}
          </p>
        </div>
        <Link href="/practice" style={{
          display: 'inline-block',
          padding: '0.7rem 1.5rem',
          borderRadius: 8,
          background: 'var(--color-cz-bg)',
          color: 'var(--color-cz-burg)',
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          Start session →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Recent sessions ── */}
        <div style={{
          background: 'var(--color-cz-surface)',
          border: '1px solid var(--color-cz-border)',
          borderRadius: 12,
          padding: '1.25rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--color-cz-text)',
            margin: '0 0 1rem',
          }}>
            Recent sessions
          </h2>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1,2,3].map(i => <Skeleton key={i} height={52} radius={8}/>)}
            </div>
          ) : recentSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>🎯</p>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-cz-muted)' }}>
                No sessions yet. Complete your first interview to see it here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentSessions.map(session => (
                <div key={session.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 8,
                  background: 'var(--color-cz-surface2)',
                  gap: '0.75rem',
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      margin: '0 0 0.15rem',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--color-cz-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {session.role}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-cz-muted)' }}>
                      {personaName(session.persona_id)} · {formatDate(session.created_at)}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: scoreColor(session.overall_score),
                    flexShrink: 0,
                  }}>
                    {session.overall_score !== null ? `${session.overall_score}%` : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentSessions.length > 0 && (
            <Link href="/analytics" style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '0.875rem',
              fontSize: '0.775rem',
              color: 'var(--color-cz-burg)',
              textDecoration: 'none',
              fontWeight: 600,
            }}>
              View all in Analytics →
            </Link>
          )}
        </div>

        {/* ── Skill breakdown ── */}
        <div style={{
          background: 'var(--color-cz-surface)',
          border: '1px solid var(--color-cz-border)',
          borderRadius: 12,
          padding: '1.25rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--color-cz-text)',
            margin: '0 0 1rem',
          }}>
            Score by question type
          </h2>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <Skeleton key={i} height={40} radius={6}/>)}
            </div>
          ) : skillBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>📊</p>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-cz-muted)' }}>
                Complete a session to see your score breakdown by question type.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {skillBreakdown.map(item => (
                <div key={item.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--color-cz-text)',
                      textTransform: 'capitalize',
                    }}>
                      {item.type}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: scoreColor(item.avgScore),
                    }}>
                      {item.avgScore}%
                    </span>
                  </div>
                  <div style={{
                    height: 6, borderRadius: 3,
                    background: 'var(--color-cz-surface3)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${item.avgScore}%`,
                      borderRadius: 3,
                      background: scoreColor(item.avgScore),
                      transition: 'width 0.5s ease',
                    }}/>
                  </div>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.68rem', color: 'var(--color-cz-subtle)' }}>
                    {item.count} answer{item.count === 1 ? '' : 's'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Profile completion prompt (if missing target_role) ── */}
      {!loading && !user?.target_role && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem 1.25rem',
          borderRadius: 10,
          background: 'var(--color-cz-blue-dim)',
          border: '1px solid var(--color-cz-blue-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ margin: '0 0 0.2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-cz-text)' }}>
              Complete your profile
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-cz-muted)' }}>
              Set your target role so we can personalise your interview questions.
            </p>
          </div>
          <Link href="/profile-setup" style={{
            padding: '0.55rem 1.1rem',
            borderRadius: 7,
            background: 'var(--color-cz-burg)',
            color: 'var(--color-cz-bg)',
            fontSize: '0.825rem',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Set up profile →
          </Link>
        </div>
      )}
    </div>
  )
}