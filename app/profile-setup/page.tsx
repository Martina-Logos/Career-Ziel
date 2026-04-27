'use client'

import { useState, type ChangeEvent, type ButtonHTMLAttributes } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { INDUSTRIES, ROLES } from '@/lib/utils'
import Input from '@/components/ui/Input'
import { ExperienceLevel } from '@/types'

const levels: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'entry',     label: 'Entry',     desc: '0–2 yrs' },
  { value: 'mid',       label: 'Mid',       desc: '3–6 yrs' },
  { value: 'senior',    label: 'Senior',    desc: '7–12 yrs' },
  { value: 'executive', label: 'Exec',      desc: '12+ yrs' },
]

export default function ProfileSetupPage() {
  const { user, setUser } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({
    name:              user?.name || '',
    currentRole:       user?.currentRole || '',
    targetRole:        user?.targetRole || '',
    industry:          user?.industry || '',
    experienceLevel:   (user?.experienceLevel || 'mid') as ExperienceLevel,
  })
  const [cvFile, setCvFile]     = useState<File | null>(null)
  const [saving, setSaving]     = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(p => ({ ...p, [field]: '' }))
  }

    function handleCvChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrors(p => ({ ...p, cv: 'Please upload a PDF file.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, cv: 'File must be under 5 MB.' }))
      return
    }
    setCvFile(file)
    setErrors(p => ({ ...p, cv: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())       e.name       = 'Name is required.'
    if (!form.targetRole)        e.targetRole = 'Please select a target role.'
    if (!form.industry)          e.industry   = 'Please select an industry.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    // Simulate save (replace with Supabase later)
    await new Promise(r => setTimeout(r, 700))
    if (user) {
      setUser({
        ...user,
        name:             form.name,
        currentRole:      form.currentRole,
        targetRole:       form.targetRole,
        industry:         form.industry,
        experienceLevel:  form.experienceLevel,
      })
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-6 py-16"
      style={{ background: 'var(--color-cz-bg)' }}>
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-cz-burg)' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#F4EFE9" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-syne font-bold text-base tracking-tight"
            style={{ color: 'var(--color-cz-text)' }}>CareerZiel</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-syne font-700 text-3xl tracking-tight mb-2"
            style={{ color: 'var(--color-cz-text)' }}>Set up your profile</h1>
          <p className="text-sm" style={{ color: 'var(--color-cz-muted)' }}>
            Helps us tailor questions to your goals. You can update this any time in Settings.
          </p>
        </div>

        <div className="glass-card p-7 space-y-5">

          {/* Name */}
          <Input
            label="Full Name *"
            placeholder="Alex Mukasa"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            error={errors.name}
          />

          {/* Current role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-cz-muted)' }}>Current Role</label>
            <select value={form.currentRole} onChange={e => update('currentRole', e.target.value)}
              className="cz-input">
              <option value="">Select your current role (optional)</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Target role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-cz-muted)' }}>
              Target Role <span style={{ color: 'var(--color-cz-burg)' }}>*</span>
            </label>
            <select value={form.targetRole} onChange={e => update('targetRole', e.target.value)}
              className="cz-input"
              style={{ borderColor: errors.targetRole ? 'var(--color-cz-red)' : undefined }}>
              <option value="">What role are you targeting?</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.targetRole && (
              <p className="text-xs" style={{ color: 'var(--color-cz-red)' }}>{errors.targetRole}</p>
            )}
          </div>

          {/* Industry */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-cz-muted)' }}>
              Industry <span style={{ color: 'var(--color-cz-burg)' }}>*</span>
            </label>
            <select value={form.industry} onChange={e => update('industry', e.target.value)}
              className="cz-input"
              style={{ borderColor: errors.industry ? 'var(--color-cz-red)' : undefined }}>
              <option value="">Select your industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {errors.industry && (
              <p className="text-xs" style={{ color: 'var(--color-cz-red)' }}>{errors.industry}</p>
            )}
          </div>

          {/* Experience level */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-cz-muted)' }}>Experience Level</label>
            <div className="grid grid-cols-4 gap-2">
              {levels.map(lvl => {
                const active = form.experienceLevel === lvl.value
                return (
                  <button key={lvl.value} type="button"
                    onClick={() => update('experienceLevel', lvl.value)}
                    className="flex flex-col items-center gap-1 py-3 px-2 rounded-[var(--radius-md)] border text-center transition-all duration-150"
                    style={{
                      background:   active ? 'var(--color-cz-burg-dim)' : 'var(--color-cz-surface2)',
                      borderColor:  active ? 'var(--color-cz-burg-border)' : 'var(--color-cz-border2)',
                      color:        active ? 'var(--color-cz-burg)' : 'var(--color-cz-muted)',
                    }}>
                    <span className="text-xs font-syne font-600">{lvl.label}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-cz-subtle)' }}>{lvl.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--color-cz-border)' }} />

          {/* CV Upload — controlled, with feedback */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-cz-muted)' }}>
              Resume / CV
              <span className="normal-case text-[10px] ml-1.5 opacity-60">(optional · PDF · max 5 MB)</span>
            </label>

            <label
              className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border border-dashed cursor-pointer transition-all"
              style={{
                borderColor: errors.cv
                  ? 'var(--color-cz-red)'
                  : cvFile
                  ? 'var(--color-cz-burg-border)'
                  : 'var(--color-cz-border2)',
                background: cvFile ? 'var(--color-cz-burg-dim)' : 'var(--color-cz-surface2)',
              }}>
              {cvFile ? (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    strokeWidth={1.6} style={{ color: 'var(--color-cz-burg)', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-cz-burg)' }}>
                      {cvFile.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-cz-muted)' }}>
                      {(cvFile.size / 1024).toFixed(0)} KB — click to replace
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); setCvFile(null) }}
                    className="text-xs shrink-0 transition-colors hover:text-[var(--color-cz-red)]"
                    style={{ color: 'var(--color-cz-muted)' }}>
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    strokeWidth={1.6} style={{ color: 'var(--color-cz-muted)', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--color-cz-muted)' }}>
                    Click to upload your CV (PDF)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleCvChange}
              />
            </label>

            {errors.cv && (
              <p className="text-xs" style={{ color: 'var(--color-cz-red)' }}>{errors.cv}</p>
            )}

            <p className="text-xs" style={{ color: 'var(--color-cz-subtle)' }}>
              Your CV will be used to generate more relevant interview questions.
              Supabase storage integration coming in Phase 2.
            </p>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSave}
            loading={saving}
            className="w-full justify-center"
            size="lg"
          >
            Save &amp; Go to Dashboard →
          </Button>

          <p className="text-center text-xs" style={{ color: 'var(--color-cz-subtle)' }}>
            * Required fields
          </p>
        </div>
      </div>
    </div>
  )
}

