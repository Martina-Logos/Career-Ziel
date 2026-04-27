'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/ui/AppShell'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell,
} from 'recharts'

const SCORE_HISTORY = [
  { date: 'Apr 1', score: 54 },
  { date: 'Apr 5', score: 61 },
  { date: 'Apr 9', score: 58 },
  { date: 'Apr 13', score: 67 },
  { date: 'Apr 17', score: 72 },
  { date: 'Apr 21', score: 74 },
  { date: 'Apr 24', score: 78 },
]

const SKILL_DATA = [
  { skill: 'Clarity', score: 72 },
  { skill: 'Confidence', score: 68 },
  { skill: 'Relevance', score: 80 },
  { skill: 'Technical', score: 75 },
  { skill: 'Structure', score: 65 },
]

const TYPE_DATA = [
  { name: 'Behavioral', value: 5, color: '#7aad8a' },
  { name: 'Technical', value: 4, color: '#CC8E0E' },
  { name: 'General', value: 3, color: '#6b9fcc' },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[var(--radius-md)] px-3 py-2 text-sm" style={{ background: 'var(--color-cz-surface2)', border: '1px solid var(--color-cz-border)', color: 'var(--color-cz-text)' }}>
        <p style={{ color: 'var(--color-cz-muted)' }}>{label}</p>
        <p className="font-syne font-600" style={{ color: 'var(--color-cz-gold-light)' }}>{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { sessions, user } = useApp()
  const totalSessions = (user?.totalSessions ?? 12)
  const totalHours = Math.round(totalSessions * 0.4 * 10) / 10
  const avgScore = 73

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-700 text-2xl tracking-tight" style={{ color: 'var(--color-cz-text)' }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-cz-muted)' }}>Track your improvement over time</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: totalSessions, color: 'var(--color-cz-text)' },
            { label: 'Hours Practiced', value: `${totalHours}h`, color: 'var(--color-cz-gold-light)' },
            { label: 'Avg. Score', value: `${avgScore}%`, color: 'var(--color-cz-gold-light)' },
            { label: 'Improvement', value: '+24pts', color: 'var(--color-cz-teal)' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-lg)] p-4"
              style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
            >
              <p className="font-syne font-700 text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-cz-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Score trend — 2/3 width */}
          <div
            className="lg:col-span-2 rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Score Trend</p>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(122,173,138,0.1)', color: 'var(--color-cz-teal)' }}>
                ↑ +24 pts overall
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={SCORE_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="date" tick={{ fill: 'var(--color-cz-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: 'var(--color-cz-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-cz-gold)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--color-cz-gold)', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'var(--color-cz-gold-light)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Interview type breakdown */}
          <div
            className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-cz-muted)' }}>By Type</p>
            <div className="flex justify-center mb-4">
              <PieChart width={140} height={140}>
                <Pie data={TYPE_DATA} cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                  {TYPE_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {TYPE_DATA.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>{t.name}</span>
                  </div>
                  <span className="text-xs font-syne font-600" style={{ color: 'var(--color-cz-text)' }}>{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill radar */}
          <div
            className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-cz-muted)' }}>Skill Heatmap</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={SKILL_DATA}>
                <PolarGrid stroke="var(--color-cz-border2)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--color-cz-muted)', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="var(--color-cz-gold)" fill="var(--color-cz-gold)" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress bars */}
          <div
            className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-5" style={{ color: 'var(--color-cz-muted)' }}>Skill Mastery</p>
            <div className="space-y-4">
              {SKILL_DATA.map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm" style={{ color: 'var(--color-cz-text)' }}>{s.skill}</span>
                    <span className="text-sm font-syne font-600" style={{ color: s.score >= 75 ? 'var(--color-cz-teal)' : 'var(--color-cz-gold)' }}>
                      {s.score}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-cz-surface2)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.score}%`,
                        background: s.score >= 75 ? 'var(--color-cz-teal)' : 'var(--color-cz-gold)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-cz-border)' }}>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--color-cz-muted)' }}>AI Recommendations</p>
              <ul className="space-y-2">
                {['Practice more Behavioral questions', 'Focus on answer structure (STAR)', 'Work on confidence signals'].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-cz-muted)' }}>
                    <span style={{ color: 'var(--color-cz-gold)', marginTop: 2 }}>→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}