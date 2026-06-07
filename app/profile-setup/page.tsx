'use client'
// app/profile-setup/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  'Software Engineer', 'Product Manager', 'Data Scientist', 'Data Analyst',
  'UX / Product Designer', 'Marketing Manager', 'Business Analyst',
  'DevOps / Platform Engineer', 'Engineering Manager', 'Other',
]

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'E-commerce & Retail',
  'Consulting', 'Media & Entertainment', 'Education', 'Government & Non-profit', 'Other',
]

const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0–2 years)' },
  { value: 'mid',    label: 'Mid-level (2–5 years)' },
  { value: 'senior', label: 'Senior (5–10 years)' },
  { value: 'lead',   label: 'Lead / Staff (10+ years)' },
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [targetRole, setTargetRole]         = useState('')
  const [customRole, setCustomRole]         = useState('')
  const [experienceLevel, setExperienceLevel] = useState('mid')
  const [industry, setIndustry]             = useState('')
  const [bio, setBio]                       = useState('')
  const [error, setError]                   = useState('')
  const [loading, setLoading]               = useState(false)

  const effectiveRole = targetRole === 'Other' ? customRole : targetRole

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!effectiveRole.trim()) { setError('Please select or enter your target role.'); return }
    if (!industry)             { setError('Please select your industry.'); return }

    setLoading(true)
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setError('Session expired. Please sign in again.')
      setLoading(false)
      router.push('/auth/login')
      return
    }

    const profileData = {
      full_name:        user.user_metadata?.full_name ?? null,
      target_role:      effectiveRole.trim(),
      experience_level: experienceLevel,
      industry,
      bio:              bio.trim() || null,
      updated_at:       new Date().toISOString(),
    }

    // Always try UPDATE first — the trigger creates the row on signup.
    // UPDATE never violates RLS insert policy.
    const { error: updateError } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', user.id)

    if (updateError) {
      // Trigger didn't fire (rare) — fall back to INSERT
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: user.id, email: user.email!, ...profileData })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cz-burg)', background: 'var(--color-cz-burg-dim)', padding: '0.25rem 0.75rem', borderRadius: 20, marginBottom: '0.875rem' }}>
            ✦ Step 1 of 1
          </div>
          <h1 style={s.heading}>Set up your profile</h1>
          <p style={s.sub}>Tell us what role you're targeting so we can personalise your questions.</p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Target role chips */}
          <div>
            <label style={s.label}>Target role</label>
            <div style={s.chipGrid}>
              {ROLES.map(role => (
                <button key={role} type="button" onClick={() => setTargetRole(role)} style={{
                  ...s.chip,
                  background: targetRole === role ? 'var(--color-cz-burg)' : 'var(--color-cz-surface2)',
                  color:      targetRole === role ? 'var(--color-cz-bg)'   : 'var(--color-cz-text)',
                  border:     targetRole === role ? '1px solid var(--color-cz-burg)' : '1px solid var(--color-cz-border2)',
                }}>
                  {role}
                </button>
              ))}
            </div>
            {targetRole === 'Other' && (
              <input type="text" placeholder="Enter your role" value={customRole}
                onChange={e => setCustomRole(e.target.value)} style={{ ...s.input, marginTop: '0.5rem' }} />
            )}
          </div>

          {/* Experience level */}
          <div>
            <label style={s.label}>Experience level</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {EXPERIENCE_LEVELS.map(({ value, label }) => (
                <label key={value} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem', borderRadius: 8, cursor: 'pointer',
                  fontSize: '0.875rem', color: 'var(--color-cz-text)',
                  border:      experienceLevel === value ? '1px solid var(--color-cz-burg)' : '1px solid var(--color-cz-border)',
                  background:  experienceLevel === value ? 'var(--color-cz-burg-dim)' : 'var(--color-cz-surface)',
                }}>
                  <input type="radio" name="experience" value={value}
                    checked={experienceLevel === value} onChange={() => setExperienceLevel(value)}
                    style={{ accentColor: 'var(--color-cz-burg)' }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label style={s.label}>Industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)} style={s.input}>
              <option value="">Select your industry</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label style={s.label}>Bio <span style={{ fontWeight: 400, color: 'var(--color-cz-muted)' }}>(optional)</span></label>
            <textarea placeholder="A short intro — helps the AI tailor questions to your background"
              value={bio} onChange={e => setBio(e.target.value)} rows={3}
              style={{ ...s.input, resize: 'vertical' }} />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving…' : 'Save and go to dashboard →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-cz-muted)' }}>
            <button type="button" onClick={() => router.push('/dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-cz-muted)', textDecoration: 'underline', fontSize: '0.8rem' }}>
              Skip for now
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

const s = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem', background: 'var(--color-cz-bg)' } as React.CSSProperties,
  card:     { width: '100%', maxWidth: 520, background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border2)', borderRadius: 14, padding: '2rem' } as React.CSSProperties,
  heading:  { fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-cz-text)', margin: '0 0 0.25rem' } as React.CSSProperties,
  sub:      { fontSize: '0.875rem', color: 'var(--color-cz-muted)', margin: 0 } as React.CSSProperties,
  label:    { display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-text)', marginBottom: '0.5rem' } as React.CSSProperties,
  input:    { width: '100%', padding: '0.7rem 0.9rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface2)', color: 'var(--color-cz-text)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' } as React.CSSProperties,
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' } as React.CSSProperties,
  chip:     { padding: '0.35rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' } as React.CSSProperties,
  btnPrimary: { width: '100%', padding: '0.8rem', borderRadius: 8, border: 'none', background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' } as React.CSSProperties,
  error:    { fontSize: '0.825rem', color: 'var(--color-cz-red)', margin: 0, padding: '0.6rem 0.75rem', background: 'var(--color-cz-red-dim)', borderRadius: 6 } as React.CSSProperties,
}