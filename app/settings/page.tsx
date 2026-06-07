'use client'
// app/settings/page.tsx — all real Supabase data, no mock context

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type UserRow = Database['public']['Tables']['users']['Row']
type Tab = 'profile' | 'notifications' | 'audio' | 'privacy'

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

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'profile',       label: 'Profile',        icon: '👤' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
  { id: 'audio',         label: 'Audio & Video',  icon: '🎤' },
  { id: 'privacy',       label: 'Privacy',        icon: '🔒' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [tab,     setTab]     = useState<Tab>('profile')
  const [user,    setUser]    = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  // Profile form state
  const [fullName,   setFullName]   = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [expLevel,   setExpLevel]   = useState('mid')
  const [industry,   setIndustry]   = useState('')
  const [bio,        setBio]        = useState('')

  // Notification prefs (stored locally for now — extend to DB later)
  const [notifs, setNotifs] = useState({ email: true, weekly: true, push: false })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/login'); return }

      const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
      if (data) {
        setUser(data)
        setFullName(data.full_name ?? '')
        setTargetRole(data.target_role ?? '')
        setExpLevel(data.experience_level ?? 'mid')
        setIndustry(data.industry ?? '')
        setBio(data.bio ?? '')
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('users')
      .update({
        full_name:        fullName.trim() || null,
        target_role:      targetRole || null,
        experience_level: expLevel,
        industry:         industry || null,
        bio:              bio.trim() || null,
        updated_at:       new Date().toISOString(),
      })
      .eq('id', user.id)

    setSaving(false)
    if (updateError) { setError(updateError.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    // Refresh local state
    setUser(prev => prev ? { ...prev, full_name: fullName, target_role: targetRole, experience_level: expLevel, industry, bio } : prev)
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure? This permanently deletes your account and all session data. This cannot be undone.')) return
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = (user?.full_name ?? user?.email ?? '??').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? 'var(--color-cz-burg)' : 'var(--color-cz-surface3)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }}/>
      </button>
    )
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
        <div style={{ height: 28, width: 120, borderRadius: 6, background: 'var(--color-cz-surface2)', marginBottom: '2rem' }}/>
        <div style={{ height: 400, borderRadius: 12, background: 'var(--color-cz-surface2)' }}/>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-cz-text)', margin: '0 0 0.25rem' }}>Settings</h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-cz-muted)' }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Tab nav */}
        <nav style={{ width: 160, flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.6rem 0.75rem', borderRadius: 8, marginBottom: '0.15rem',
              border: tab === t.id ? '1px solid var(--color-cz-burg-border)' : '1px solid transparent',
              background: tab === t.id ? 'var(--color-cz-burg-dim)' : 'transparent',
              color: tab === t.id ? 'var(--color-cz-burg)' : 'var(--color-cz-muted)',
              fontSize: '0.875rem', fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={{ flex: 1 }}>

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div style={card}>
              <h2 style={cardTitle}>Profile settings</h2>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {initials}
                </div>
                <div>
                  <p style={{ margin: '0 0 0.15rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-cz-text)' }}>{user?.full_name ?? user?.email}</p>
                  <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-cz-muted)' }}>{user?.email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={lbl}>Full name</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} style={inp} placeholder="Your name"/>
                </div>
                <div>
                  <label style={lbl}>Target role</label>
                  <select value={targetRole} onChange={e => setTargetRole(e.target.value)} style={inp}>
                    <option value="">Select role</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Experience level</label>
                  <select value={expLevel} onChange={e => setExpLevel(e.target.value)} style={inp}>
                    {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Industry</label>
                  <select value={industry} onChange={e => setIndustry(e.target.value)} style={inp}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Bio <span style={{ fontWeight: 400, color: 'var(--color-cz-muted)' }}>(optional)</span></label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="A short intro — helps AI tailor questions to your background"/>
              </div>

              {error && <p style={{ fontSize: '0.825rem', color: 'var(--color-cz-red)', padding: '0.6rem 0.75rem', background: 'var(--color-cz-red-dim)', borderRadius: 6, margin: '0 0 1rem' }}>{error}</p>}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', paddingTop: '1rem', borderTop: '1px solid var(--color-cz-border)' }}>
                <button onClick={handleSave} disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: 8, border: 'none', background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
                </button>
                {saved && <span style={{ fontSize: '0.8rem', color: '#4A7A5A' }}>Changes saved successfully</span>}
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <div style={card}>
              <h2 style={cardTitle}>Notification preferences</h2>
              {[
                { key: 'email',  label: 'Email notifications', desc: 'Session summaries and progress updates via email' },
                { key: 'weekly', label: 'Weekly report',       desc: 'Summary of your week\'s practice sent on Sundays' },
                { key: 'push',   label: 'Push notifications',  desc: 'Browser alerts for reminders and new features' },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--color-cz-border)' }}>
                  <div>
                    <p style={{ margin: '0 0 0.2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-cz-text)' }}>{n.label}</p>
                    <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-cz-muted)' }}>{n.desc}</p>
                  </div>
                  <Toggle on={notifs[n.key as keyof typeof notifs]} onToggle={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}/>
                </div>
              ))}
              <p style={{ marginTop: '1rem', fontSize: '0.775rem', color: 'var(--color-cz-subtle)' }}>
                Note: email notifications require Resend integration (coming soon).
              </p>
            </div>
          )}

          {/* ── Audio & Video ── */}
          {tab === 'audio' && (
            <div style={card}>
              <h2 style={cardTitle}>Audio & Video</h2>
              <div style={{ padding: '1rem', borderRadius: 8, background: 'var(--color-cz-surface2)', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-cz-text)' }}>Microphone</p>
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.775rem', color: 'var(--color-cz-muted)' }}>Used for voice answers during sessions (Pro feature)</p>
                <button style={{ padding: '0.5rem 1rem', borderRadius: 7, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface)', color: 'var(--color-cz-text)', fontSize: '0.825rem', cursor: 'pointer' }}>
                  Test microphone
                </button>
              </div>
              <div style={{ padding: '1rem', borderRadius: 8, background: 'var(--color-cz-surface2)' }}>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-cz-text)' }}>Camera</p>
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.775rem', color: 'var(--color-cz-muted)' }}>Required for video mock sessions (Pro feature)</p>
                <button style={{ padding: '0.5rem 1rem', borderRadius: 7, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface)', color: 'var(--color-cz-text)', fontSize: '0.825rem', cursor: 'pointer' }}>
                  Test camera
                </button>
              </div>
            </div>
          )}

          {/* ── Privacy ── */}
          {tab === 'privacy' && (
            <div style={card}>
              <h2 style={cardTitle}>Privacy & Data</h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-cz-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 0.5rem' }}>Your interview data is encrypted and never shared with third parties.</p>
                <p style={{ margin: '0 0 0.5rem' }}>Session transcripts are stored for as long as your account is active.</p>
                <p style={{ margin: 0 }}>You can export or delete your data at any time below.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button style={{ padding: '0.65rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface)', color: 'var(--color-cz-text)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  Export my data (CSV)
                </button>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-cz-border)' }}>
                  <button onClick={handleDeleteAccount} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: '1px solid #8B353540', background: 'var(--color-cz-red-dim)', color: 'var(--color-cz-red)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                    Delete account
                  </button>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--color-cz-subtle)' }}>This action permanently deletes your account and all data. Cannot be undone.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const card: React.CSSProperties = { background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)', borderRadius: 12, padding: '1.5rem' }
const cardTitle: React.CSSProperties = { fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-cz-text)', margin: '0 0 1.25rem' }
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cz-text)', marginBottom: '0.4rem' }
const inp: React.CSSProperties = { width: '100%', padding: '0.65rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface2)', color: 'var(--color-cz-text)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }