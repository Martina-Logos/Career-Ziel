'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp, MOCK_USER } from '@/context/AppContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function passwordStrength(p: string): { score: number; label: string; color: string } {
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'var(--color-cz-red)', 'var(--color-cz-amber)', 'var(--color-cz-teal)', 'var(--color-cz-teal)']
  return { score, label: labels[score] || '', color: colors[score] || '' }
}

export default function SignupPage() {
  const { setUser } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const pw = passwordStrength(form.password)

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [field]: e.target.value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (!agreed) { setError('Please agree to the terms.'); return }
    if (pw.score < 2) { setError('Please choose a stronger password.'); return }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 900))
    setUser({ ...MOCK_USER, name: form.name, email: form.email })
    router.push('/onboarding')
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-syne font-700 text-2xl tracking-tight mb-1.5">Create your account</h1>
        <p className="text-sm text-[var(--color-cz-muted)]">
          Already have one?{' '}
          <Link href="/auth/login" className="text-[var(--color-cz-violet-light)] hover:underline">Sign in</Link>
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-cz-red-dim)] border border-[var(--color-cz-red)]/20 text-sm text-[var(--color-cz-red)]">
            {error}
          </div>
        )}

        <Input label="Full Name" placeholder="Alex Mukasa" value={form.name} onChange={update('name')} autoComplete="name" />
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} autoComplete="email" />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[var(--color-cz-muted)] uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
              className="cz-input pr-11"
            />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cz-muted)] hover:text-[var(--color-cz-text)]">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
          </div>
          {form.password && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1 flex-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={cn('h-1 flex-1 rounded-full transition-all duration-300', i <= pw.score ? 'opacity-100' : 'opacity-20')}
                    style={{ background: i <= pw.score ? pw.color : 'var(--color-cz-surface3)' }} />
                ))}
              </div>
              <span className="text-xs" style={{ color: pw.color }}>{pw.label}</span>
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <div className={cn('w-4 h-4 mt-0.5 rounded border shrink-0 flex items-center justify-center transition-all', agreed ? 'bg-[var(--color-cz-violet)] border-[var(--color-cz-violet)]' : 'border-[var(--color-cz-border2)]')}
            onClick={() => setAgreed(p => !p)}>
            {agreed && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className="text-xs text-[var(--color-cz-muted)] leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-[var(--color-cz-violet-light)] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[var(--color-cz-violet-light)] hover:underline">Privacy Policy</a>
          </span>
        </label>

        <Button type="submit" loading={loading} className="w-full justify-center" size="lg">
          Create Account →
        </Button>
      </form>
    </div>
  )
}