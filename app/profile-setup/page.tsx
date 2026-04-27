'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { INDUSTRIES, ROLES } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ExperienceLevel } from '@/types'

const levels: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'entry', label: 'Entry', desc: '0–2 years' },
  { value: 'mid', label: 'Mid-level', desc: '3–6 years' },
  { value: 'senior', label: 'Senior', desc: '7–12 years' },
  { value: 'executive', label: 'Executive', desc: '12+ years' },
]

export default function ProfileSetupPage() {
  const { user, setUser } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({
    name: user?.name || '',
    currentRole: user?.currentRole || '',
    targetRole: '',
    industry: '',
    experienceLevel: 'mid' as ExperienceLevel,
  })
  const [saving, setSaving] = useState(false)

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  async function handleSave() {
    if (!form.name || !form.targetRole || !form.industry) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    if (user) {
      setUser({
        ...user,
        name: form.name,
        currentRole: form.currentRole,
        targetRole: form.targetRole,
        industry: form.industry,
        experienceLevel: form.experienceLevel,
      })
    }
    router.push('/dashboard')
  }

  const isComplete = form.name && form.targetRole && form.industry

  return (
    <div className="min-h-screen flex items-start justify-center px-6 py-16" style={{ background: 'var(--color-cz-bg)' }}>
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-cz-gold)' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#1a1910" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-syne font-bold text-base tracking-tight" style={{ color: 'var(--color-cz-text)' }}>CareerZiel</span>
          </div>
          <h1 className="font-syne font-700 text-3xl tracking-tight mb-2" style={{ color: 'var(--color-cz-text)' }}>
            Set up your profile
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-cz-muted)' }}>
            Help us tailor questions to your goals. You can update this anytime.
          </p>
        </div>

        <div className="glass-card p-7 space-y-6">
          {/* Name */}
          <Input
            label="Full Name"
            placeholder="Alex Mukasa"
            value={form.name}
            onChange={e => update('name', e.target.value)}
          />

          {/* Current role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>
              Current Role
            </label>
            <select
              value={form.currentRole}
              onChange={e => update('currentRole', e.target.value)}
              className="cz-input"
            >
              <option value="">Select your current role</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Target role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>
              Target Role <span style={{ color: 'var(--color-cz-gold)' }}>*</span>
            </label>
            <select
              value={form.targetRole}
              onChange={e => update('targetRole', e.target.value)}
              className="cz-input"
            >
              <option value="">What role are you targeting?</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Industry */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>
              Industry <span style={{ color: 'var(--color-cz-gold)' }}>*</span>
            </label>
            <select
              value={form.industry}
              onChange={e => update('industry', e.target.value)}
              className="cz-input"
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* Experience level */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>
              Experience Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {levels.map(lvl => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => update('experienceLevel', lvl.value)}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-[var(--radius-md)] border text-center transition-all duration-150"
                  style={{
                    background: form.experienceLevel === lvl.value ? 'var(--color-cz-gold-dim)' : 'var(--color-cz-surface2)',
                    borderColor: form.experienceLevel === lvl.value ? 'var(--color-cz-gold-border)' : 'var(--color-cz-border)',
                    color: form.experienceLevel === lvl.value ? 'var(--color-cz-gold-light)' : 'var(--color-cz-muted)',
                  }}
                >
                  <span className="text-xs font-syne font-600">{lvl.label}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-cz-subtle)' }}>{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--color-cz-border)' }} />

          {/* Optional: Upload resume */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>
              Resume <span className="normal-case text-[10px] opacity-60">(optional · PDF)</span>
            </label>
            <label
              className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border border-dashed cursor-pointer transition-colors hover:border-[var(--color-cz-gold-border)]"
              style={{ borderColor: 'var(--color-cz-border2)', color: 'var(--color-cz-muted)' }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm">Upload resume PDF</span>
              <input type="file" accept=".pdf" className="hidden" />
            </label>
          </div>

          <Button
            onClick={handleSave}
            loading={saving}
            disabled={!isComplete}
            className="w-full justify-center"
            size="lg"
          >
            Save &amp; Go to Dashboard →
          </Button>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-cz-subtle)' }}>
          You can update all of this later in Settings
        </p>
      </div>
    </div>
  )
}