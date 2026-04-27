'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import AppShell from '@/components/ui/AppShell'
import { ROLES, INDUSTRIES } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Tab = 'profile' | 'notifications' | 'privacy' | 'audio'

export default function SettingsPage() {
  const { user, setUser } = useApp()
  const [tab, setTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    targetRole: user?.targetRole || '',
    industry: user?.industry || '',
  })
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true })
  const [language, setLanguage] = useState('English')

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  async function handleSave() {
    if (user) {
      setUser({ ...user, name: form.name, targetRole: form.targetRole, industry: form.industry })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'audio', label: 'Audio & Video', icon: '🎤' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
  ]

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne font-700 text-2xl tracking-tight" style={{ color: 'var(--color-cz-text)' }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-cz-muted)' }}>Manage your account and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Tab nav */}
          <nav className="w-44 shrink-0 space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-left transition-all"
                style={{
                  background: tab === t.id ? 'var(--color-cz-gold-dim)' : 'transparent',
                  color: tab === t.id ? 'var(--color-cz-gold-light)' : 'var(--color-cz-muted)',
                  border: tab === t.id ? '1px solid var(--color-cz-gold-border)' : '1px solid transparent',
                }}
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1">
            {/* Profile tab */}
            {tab === 'profile' && (
              <div
                className="rounded-[var(--radius-lg)] p-6 space-y-5"
                style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
              >
                <h2 className="font-syne font-600 text-base" style={{ color: 'var(--color-cz-text)' }}>Profile Settings</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-syne font-600"
                    style={{ background: 'var(--color-cz-gold-dim)', color: 'var(--color-cz-gold-light)', border: '2px solid var(--color-cz-gold-border)' }}
                  >
                    {user?.name?.slice(0, 2).toUpperCase() || 'AM'}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-cz-text)' }}>{user?.name}</p>
                    <button className="text-xs mt-1" style={{ color: 'var(--color-cz-gold)' }}>Upload photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" value={form.name} onChange={e => update('name', e.target.value)} />
                  <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Target Role</label>
                    <select value={form.targetRole} onChange={e => update('targetRole', e.target.value)} className="cz-input">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Industry</label>
                    <select value={form.industry} onChange={e => update('industry', e.target.value)} className="cz-input">
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="cz-input" style={{ maxWidth: 240 }}>
                    {['English', 'Luganda', 'Swahili', 'French', 'Arabic'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid var(--color-cz-border)' }}>
                  <Button onClick={handleSave}>
                    {saved ? '✓ Saved!' : 'Save Changes'}
                  </Button>
                  {saved && <span className="text-xs" style={{ color: 'var(--color-cz-teal)' }}>Changes saved successfully</span>}
                </div>
              </div>
            )}

            {/* Notifications tab */}
            {tab === 'notifications' && (
              <div
                className="rounded-[var(--radius-lg)] p-6 space-y-5"
                style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
              >
                <h2 className="font-syne font-600 text-base" style={{ color: 'var(--color-cz-text)' }}>Notification Preferences</h2>
                {[
                  { key: 'email', label: 'Email notifications', desc: 'Session summaries and progress updates via email' },
                  { key: 'push', label: 'Push notifications', desc: 'Browser alerts for reminders and new features' },
                  { key: 'weekly', label: 'Weekly report', desc: 'Summary of your week\'s practice sent on Sundays' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-cz-border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-cz-text)' }}>{n.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-cz-muted)' }}>{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                      className="w-11 h-6 rounded-full transition-all relative"
                      style={{ background: notifs[n.key as keyof typeof notifs] ? 'var(--color-cz-gold)' : 'var(--color-cz-surface3)' }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                        style={{
                          background: 'var(--color-cz-text)',
                          left: notifs[n.key as keyof typeof notifs] ? 'calc(100% - 22px)' : '2px',
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Audio tab */}
            {tab === 'audio' && (
              <div
                className="rounded-[var(--radius-lg)] p-6 space-y-5"
                style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
              >
                <h2 className="font-syne font-600 text-base" style={{ color: 'var(--color-cz-text)' }}>Audio &amp; Video</h2>
                <div className="rounded-[var(--radius-md)] p-4" style={{ background: 'var(--color-cz-surface2)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-cz-text)' }}>Microphone</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--color-cz-muted)' }}>Used for voice answers during sessions</p>
                  <Button variant="secondary" size="sm">Test Microphone</Button>
                </div>
                <div className="rounded-[var(--radius-md)] p-4" style={{ background: 'var(--color-cz-surface2)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-cz-text)' }}>Camera</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--color-cz-muted)' }}>Required for video mock sessions (Pro)</p>
                  <Button variant="secondary" size="sm">Test Camera</Button>
                </div>
              </div>
            )}

            {/* Privacy tab */}
            {tab === 'privacy' && (
              <div
                className="rounded-[var(--radius-lg)] p-6 space-y-5"
                style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
              >
                <h2 className="font-syne font-600 text-base" style={{ color: 'var(--color-cz-text)' }}>Privacy &amp; Data</h2>
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-cz-muted)' }}>
                  <p>Your interview data is encrypted and never shared with third parties.</p>
                  <p>Session transcripts are stored for 90 days by default.</p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Button variant="secondary">Export My Data (CSV)</Button>
                  <Button variant="secondary">Clear Session History</Button>
                  <div className="pt-2" style={{ borderTop: '1px solid var(--color-cz-border)' }}>
                    <Button variant="danger" size="sm">Delete Account</Button>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-cz-muted)' }}>This action cannot be undone.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}