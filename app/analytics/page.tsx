'use client'
// app/analytics/page.tsx — real Supabase data, skill breakdown restored.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PERSONAS } from '@/lib/personas'

interface SessionRow {
  id: string
  role: string
  difficulty: string
  persona_id: string
  overall_score: number | null
  created_at: string
  duration_secs: number | null
}

interface AnswerRow {
  question_type: string
  score: number | null
  ai_feedback: string | null
}

function scoreColor(score: number) {
  if (score >= 80) return '#4A7A5A'
  if (score >= 60) return '#A0622A'
  return '#8B3535'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function personaEmoji(id: string) { return PERSONAS.find(p => p.id === id)?.emoji ?? '🎯' }
function personaName(id: string)  { return PERSONAS.find(p => p.id === id)?.name  ?? id  }

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.825rem', color: 'var(--color-cz-text)', textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: scoreColor(score) }}>{score}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--color-cz-surface3)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, borderRadius: 3, background: scoreColor(score), transition: 'width 0.6s ease' }}/>
      </div>
    </div>
  )
}

function ScoreTrend({ sessions }: { sessions: SessionRow[] }) {
  const scored = [...sessions].filter(s => s.overall_score !== null).reverse()
  if (scored.length < 2) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: 'var(--color-cz-muted)', fontSize: '0.825rem' }}>
        Complete at least 2 sessions to see your trend
      </div>
    )
  }
  const scores = scored.map(s => s.overall_score as number)
  const minS = Math.max(0, Math.min(...scores) - 10)
  const maxS = Math.min(100, Math.max(...scores) + 10)
  const W = 520, H = 140, padL = 32, padR = 16, padT = 10, padB = 28
  const xStep = (W - padL - padR) / (scored.length - 1)
  const yScale = (v: number) => padT + ((maxS - v) / (maxS - minS)) * (H - padT - padB)
  const xPos   = (i: number) => padL + i * xStep
  const pathD  = scored.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yScale(s.overall_score!).toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      {[minS, Math.round((minS + maxS) / 2), maxS].map(v => (
        <g key={v}>
          <line x1={padL} y1={yScale(v)} x2={W - padR} y2={yScale(v)} stroke="var(--color-cz-border)" strokeWidth={0.5} strokeDasharray="3,3"/>
          <text x={padL - 4} y={yScale(v) + 4} fontSize={9} fill="var(--color-cz-subtle)" textAnchor="end">{v}</text>
        </g>
      ))}
      <path d={pathD} fill="none" stroke="var(--color-cz-burg)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      {scored.map((s, i) => (
        <g key={i}>
          <circle cx={xPos(i)} cy={yScale(s.overall_score!)} r={3.5} fill="var(--color-cz-burg)"/>
          <text x={xPos(i)} y={H - 6} fontSize={8.5} fill="var(--color-cz-subtle)" textAnchor="middle">{formatDate(s.created_at)}</text>
        </g>
      ))}
    </svg>
  )
}

export default function AnalyticsPage() {
  const [sessions, setSessions]   = useState<SessionRow[]>([])
  const [answers,  setAnswers]    = useState<AnswerRow[]>([])
  const [loading,  setLoading]    = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [sessRes, ansRes] = await Promise.all([
        supabase.from('sessions').select('id,role,difficulty,persona_id,overall_score,created_at,duration_secs').eq('user_id', user.id).eq('status', 'completed').order('created_at', { ascending: false }),
        supabase.from('session_answers').select('question_type,score,ai_feedback').eq('user_id', user.id).not('score', 'is', null),
      ])
      if (cancelled) return
      setSessions((sessRes.data ?? []) as SessionRow[])
      setAnswers((ansRes.data ?? []) as AnswerRow[])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const scores       = sessions.map(s => s.overall_score).filter((s): s is number => s !== null)
  const totalSessions = sessions.length
  const avgScore      = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const bestScore     = scores.length ? Math.max(...scores) : null
  const totalMins     = Math.round(sessions.reduce((a, s) => a + (s.duration_secs ?? 0), 0) / 60)
  const improvement   = scores.length >= 2 ? scores[0] - scores[scores.length - 1] : null

  // Score by question type
  const byType = (() => {
    const g: Record<string, number[]> = {}
    answers.forEach(a => {
      if (!a.question_type || a.score === null) return
      if (!g[a.question_type]) g[a.question_type] = []
      g[a.question_type].push(a.score)
    })
    return Object.entries(g).map(([type, scores]) => ({
      type, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length,
    }))
  })()

  // Skill breakdown — map question types to skill labels
  // We derive "skill scores" as averages per question_type
  const skillLabels: Record<string, string> = {
    technical:  'Technical',
    behavioral: 'Behavioral',
    general:    'General',
  }

  // Persona breakdown
  const byPersona = (() => {
    const g: Record<string, number[]> = {}
    sessions.forEach(s => {
      if (s.overall_score === null) return
      if (!g[s.persona_id]) g[s.persona_id] = []
      g[s.persona_id].push(s.overall_score)
    })
    return Object.entries(g).map(([id, scores]) => ({
      id, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length,
    })).sort((a, b) => b.avg - a.avg)
  })()

  // AI recommendations based on weakest skill
  const recommendations = (() => {
    if (byType.length === 0) return []
    const sorted = [...byType].sort((a, b) => a.avg - b.avg)
    const recs: string[] = []
    if (sorted[0]) recs.push(`Practise more ${sorted[0].type} questions — your lowest area at ${sorted[0].avg}%`)
    if (sorted[0]?.type === 'behavioral') recs.push('Focus on STAR method structure (Situation → Task → Action → Result)')
    if (sorted[0]?.avg < 60) recs.push('Try the Friendly persona to build foundational confidence first')
    recs.push('Aim for 3+ sessions per week to see meaningful score improvement')
    return recs.slice(0, 3)
  })()

  function Skeleton({ h = 80 }: { h?: number }) {
    return <div style={{ height: h, borderRadius: 10, background: 'linear-gradient(90deg, var(--color-cz-surface2) 25%, var(--color-cz-surface3) 50%, var(--color-cz-surface2) 75%)', backgroundSize: '200% 100%' }}/>
  }

  const noData = !loading && sessions.length === 0

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-cz-text)', margin: '0 0 0.25rem' }}>Analytics</h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-cz-muted)' }}>Track your improvement over time</p>
      </div>

      {noData ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-cz-surface)', borderRadius: 14, border: '1px solid var(--color-cz-border)' }}>
          <p style={{ fontSize: '2rem', margin: '0 0 1rem' }}>📊</p>
          <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-cz-text)', margin: '0 0 0.5rem' }}>No data yet</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-cz-muted)', margin: '0 0 1.5rem' }}>Complete your first interview session to see analytics here.</p>
          <a href="/practice" style={{ display: 'inline-block', padding: '0.7rem 1.5rem', borderRadius: 8, background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Start practising →</a>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {loading ? [1,2,3,4].map(i => <Skeleton key={i} h={90}/>) : (
              <>
                {[
                  { label: 'Total sessions',  value: totalSessions },
                  { label: 'Average score',   value: avgScore  != null ? `${avgScore}%`  : '—' },
                  { label: 'Best score',      value: bestScore != null ? `${bestScore}%` : '—' },
                  { label: 'Time practised',  value: totalMins > 0 ? `${totalMins}m` : '0m' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.1rem' }}>
                    <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', color: 'var(--color-cz-muted)' }}>{label}</p>
                    <p style={{ margin: 0, fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.6rem', color: 'var(--color-cz-text)', lineHeight: 1 }}>{value}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Score trend */}
          <div style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-cz-text)', margin: 0 }}>Score trend</h2>
              {improvement != null && (
                <span style={{ fontSize: '0.775rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20, background: improvement >= 0 ? '#4A7A5A18' : '#8B353518', color: improvement >= 0 ? '#4A7A5A' : '#8B3535' }}>
                  {improvement >= 0 ? '↑' : '↓'} {Math.abs(improvement)}pts overall
                </span>
              )}
            </div>
            {loading ? <Skeleton h={140}/> : <ScoreTrend sessions={sessions}/>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* Skill breakdown by question type */}
            <div style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-cz-text)', margin: '0 0 1rem' }}>Skill mastery</h2>
              {loading ? <Skeleton h={160}/> : byType.length === 0 ? (
                <p style={{ fontSize: '0.825rem', color: 'var(--color-cz-muted)' }}>No answer data yet</p>
              ) : (
                <>
                  {byType.map(item => (
                    <ScoreBar key={item.type} label={skillLabels[item.type] ?? item.type} score={item.avg}/>
                  ))}
                  {/* AI Recommendations */}
                  {recommendations.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-cz-border)' }}>
                      <p style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--color-cz-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.6rem' }}>AI Recommendations</p>
                      {recommendations.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--color-cz-burg)', flexShrink: 0, fontSize: '0.8rem' }}>→</span>
                          <span style={{ fontSize: '0.775rem', color: 'var(--color-cz-muted)', lineHeight: 1.4 }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Persona breakdown */}
            <div style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-cz-text)', margin: '0 0 1rem' }}>Score by persona</h2>
              {loading ? <Skeleton h={160}/> : byPersona.length === 0 ? (
                <p style={{ fontSize: '0.825rem', color: 'var(--color-cz-muted)' }}>No persona data yet</p>
              ) : (
                byPersona.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{personaEmoji(item.id)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.775rem', color: 'var(--color-cz-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{personaName(item.id)}</span>
                        <span style={{ fontSize: '0.775rem', fontWeight: 700, color: scoreColor(item.avg), flexShrink: 0, marginLeft: '0.5rem' }}>{item.avg}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'var(--color-cz-surface3)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.avg}%`, borderRadius: 2, background: scoreColor(item.avg) }}/>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-cz-subtle)', flexShrink: 0 }}>{item.count}x</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Session history */}
          <div style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-cz-text)', margin: '0 0 1rem' }}>Session history</h2>
            {loading ? <Skeleton h={200}/> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sessions.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 8, background: 'var(--color-cz-surface2)' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{personaEmoji(s.persona_id)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 0.15rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.role}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-cz-muted)' }}>{personaName(s.persona_id)} · {s.difficulty} · {formatDate(s.created_at)}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: '0 0 0.1rem', fontSize: '0.875rem', fontWeight: 700, color: s.overall_score != null ? scoreColor(s.overall_score) : 'var(--color-cz-muted)' }}>
                        {s.overall_score != null ? `${s.overall_score}%` : '—'}
                      </p>
                      {s.duration_secs != null && <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--color-cz-subtle)' }}>{Math.round(s.duration_secs / 60)}m</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}