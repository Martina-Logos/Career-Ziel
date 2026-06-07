'use client'
// app/auth/signup/page.tsx
// Uses signInWithOtp (magic link / OTP) style confirmation.
// This avoids the PKCE verifier cookie problem entirely.
// The email link contains a token_hash that the callback handles server-side.

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Step = 'form' | 'verify'

export default function SignupPage() {
  const [step, setStep] = useState<Step>('form')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = (() => {
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#8B3535', '#A0622A', '#4A7A5A', '#2A6A4A'][strength]

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    const supabase = createClient()

    // Step 1: Create the account with email+password
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // Do NOT pass emailRedirectTo here — let Supabase use the Site URL
        // from the dashboard, which sends a token_hash link instead of PKCE
      },
    })

    setLoading(false)

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    // If Supabase returns a session immediately it means email confirmation
    // is disabled — go straight to profile setup
    if (signUpData.session) {
      window.location.href = '/profile-setup'
      return
    }

    // Email confirmation is on — show the verify step
    setStep('verify')
  }

  async function handleResend() {
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    if (error) setError(error.message)
  }

  // ── Verify screen ─────────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-cz-burg-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>✉️</div>
          <h1 style={styles.heading}>Check your email</h1>
          <p style={styles.sub}>
            We sent a verification link to{' '}
            <strong style={{ color: 'var(--color-cz-text)' }}>{email}</strong>.
            Click the link to activate your account.
          </p>
          <div style={{ padding: '0.875rem', borderRadius: 8, background: 'var(--color-cz-surface2)', border: '1px solid var(--color-cz-border2)', fontSize: '0.825rem', color: 'var(--color-cz-muted)', margin: '1rem 0' }}>
            <strong style={{ color: 'var(--color-cz-text)' }}>Did not get it?</strong> Check your spam folder, or resend below.
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button onClick={handleResend} style={{ ...styles.btnSecondary, width: '100%', marginBottom: '0.75rem' }}>
            Resend verification email
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--color-cz-muted)' }}>
            Wrong email?{' '}
            <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-cz-burg)', fontWeight: 600, padding: 0 }}>
              Go back
            </button>
          </p>
        </div>
      </div>
    )
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={{ ...styles.sub, marginBottom: '1.5rem' }}>Start practising interviews with AI today.</p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={styles.label}>Full name</label>
            <input type="text" placeholder="Your name" value={fullName} onChange={e => setFullName(e.target.value)} required style={styles.input} />
          </div>
          <div>
            <label style={styles.label}>Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
            {password.length > 0 && (
              <div style={{ marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : 'var(--color-cz-border2)', transition: 'background 0.2s' }}/>
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>
          <div>
            <label style={styles.label}>Confirm password</label>
            <input type="password" placeholder="Repeat your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              style={{ ...styles.input, borderColor: confirmPassword && confirmPassword !== password ? 'var(--color-cz-red)' : undefined }} />
            {confirmPassword && confirmPassword !== password && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-cz-red)', marginTop: 4 }}>Passwords do not match</p>
            )}
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...styles.btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--color-cz-muted)', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--color-cz-burg)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--color-cz-bg)' } as React.CSSProperties,
  card: { width: '100%', maxWidth: 420, background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border2)', borderRadius: 14, padding: '2rem' } as React.CSSProperties,
  heading: { fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-cz-text)', margin: '0 0 0.25rem', textAlign: 'center' } as React.CSSProperties,
  sub: { fontSize: '0.875rem', color: 'var(--color-cz-muted)', margin: 0, textAlign: 'center' } as React.CSSProperties,
  label: { display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-text)', marginBottom: '0.35rem' } as React.CSSProperties,
  input: { width: '100%', padding: '0.7rem 0.9rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface2)', color: 'var(--color-cz-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties,
  btnPrimary: { width: '100%', padding: '0.75rem', borderRadius: 8, border: 'none', background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' } as React.CSSProperties,
  btnSecondary: { padding: '0.7rem', borderRadius: 8, border: '1px solid var(--color-cz-border2)', background: 'var(--color-cz-surface)', color: 'var(--color-cz-text)', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' } as React.CSSProperties,
  errorText: { fontSize: '0.825rem', color: 'var(--color-cz-red)', margin: 0, padding: '0.6rem 0.75rem', background: 'var(--color-cz-red-dim)', borderRadius: 6 } as React.CSSProperties,
}