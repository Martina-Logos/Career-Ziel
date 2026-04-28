'use client'
// hooks/useDashboard.ts
// Fetches everything the dashboard page needs in one hook:
// - stats (total sessions, avg score, streak, best score)
// - recent sessions (last 5)
// - skill breakdown (per question_type avg score)

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface DashboardStats {
  totalSessions: number
  avgScore: number | null
  currentStreak: number
  bestScore: number | null
  sessionsThisWeek: number
}

export interface RecentSession {
  id: string
  role: string
  difficulty: string
  persona_id: string
  overall_score: number | null
  status: string
  created_at: string
  question_types: string[]
}

export interface SkillBreakdown {
  type: string
  avgScore: number
  count: number
}

interface UseDashboardResult {
  stats: DashboardStats | null
  recentSessions: RecentSession[]
  skillBreakdown: SkillBreakdown[]
  loading: boolean
  error: string | null
}

export function useDashboard(): UseDashboardResult {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [skillBreakdown, setSkillBreakdown] = useState<SkillBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Run all queries in parallel
      const [sessionsRes, userRes, answersRes] = await Promise.all([
        // All completed sessions
        supabase
          .from('sessions')
          .select('id, role, difficulty, persona_id, overall_score, status, created_at, question_types')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false }),

        // User row for streak
        supabase
          .from('users')
          .select('streak')
          .eq('id', user.id)
          .single(),

        // Answers for skill breakdown
        supabase
          .from('session_answers')
          .select('question_type, score')
          .eq('user_id', user.id)
          .not('score', 'is', null),
      ])

      if (cancelled) return

      if (sessionsRes.error) { setError(sessionsRes.error.message); setLoading(false); return }

      const sessions = sessionsRes.data ?? []
      const scores = sessions.map(s => s.overall_score).filter((s): s is number => s !== null)

      // Sessions this week
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const thisWeek = sessions.filter(s => new Date(s.created_at) > weekAgo).length

      setStats({
        totalSessions: sessions.length,
        avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
        currentStreak: userRes.data?.streak ?? 0,
        bestScore: scores.length ? Math.max(...scores) : null,
        sessionsThisWeek: thisWeek,
      })

      setRecentSessions(sessions.slice(0, 5) as RecentSession[])

      // Skill breakdown from answers
      if (answersRes.data) {
        const grouped: Record<string, number[]> = {}
        for (const a of answersRes.data) {
          if (!a.question_type || a.score === null) continue
          if (!grouped[a.question_type]) grouped[a.question_type] = []
          grouped[a.question_type].push(a.score)
        }
        const breakdown: SkillBreakdown[] = Object.entries(grouped).map(([type, scores]) => ({
          type,
          avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          count: scores.length,
        }))
        setSkillBreakdown(breakdown)
      }

      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { stats, recentSessions, skillBreakdown, loading, error }
}