'use client'
// app/auth/login/page.tsx

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (authError) {
      // Give user-friendly messages instead of Supabase internals
      if (authError.message.includes('Email not confirmed')) {
        setError('Please verify your email first. Check your inbox for the verification link.')
      } else if (authError.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password.')
      } else {
        setError(authError.message)
      }
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
    })
    if (error) { setError(error.message); return }
    setResetSent(true)
  }

  // ── Password reset view ───────────────────────────────────────────────────
  if (showReset) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.heading}>Reset your password</h1>
          <p style={styles.sub}>
            {resetSent
              ? `A reset link has been sent to ${email}.`
              : "Enter your email and we'll send you a reset link."}
          </p>

          {!resetSent && (
            <form onSubmit={handlePasswordReset} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="you@example.com"
                />
              </div>
              {error && <p style={styles.errorText}>{error}</p>}
              <button type="submit" style={styles.btnPrimary}>Send reset link</button>
            </form>
          )}

          <button
            onClick={() => { setShowReset(false); setResetSent(false) }}
            style={{ ...styles.btnSecondary, width: '100%', marginTop: '0.75rem' }}
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  // ── Login form ────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.sub}>Sign in to continue practising.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              style={styles.input}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={styles.label}>Password</label>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                style={{ fontSize: '0.775rem', color: 'var(--color-cz-burg)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btnPrimary, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--color-cz-muted)', marginTop: '1.25rem' }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--color-cz-burg)', fontWeight: 600, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'var(--color-cz-bg)',
  } as React.CSSProperties,
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--color-cz-surface)',
    border: '1px solid var(--color-cz-border2)',
    borderRadius: 14,
    padding: '2rem',
  } as React.CSSProperties,
  heading: {
    fontFamily: 'var(--font-syne)',
    fontWeight: 700,
    fontSize: '1.4rem',
    color: 'var(--color-cz-text)',
    margin: '0 0 0.25rem',
    textAlign: 'center',
  } as React.CSSProperties,
  sub: {
    fontSize: '0.875rem',
    color: 'var(--color-cz-muted)',
    margin: 0,
    textAlign: 'center',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: '0.825rem',
    fontWeight: 600,
    color: 'var(--color-cz-text)',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: 8,
    border: '1px solid var(--color-cz-border2)',
    background: 'var(--color-cz-surface2)',
    color: 'var(--color-cz-text)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  btnPrimary: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 8,
    border: 'none',
    background: 'var(--color-cz-burg)',
    color: 'var(--color-cz-bg)',
    fontFamily: 'var(--font-syne)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  } as React.CSSProperties,
  btnSecondary: {
    padding: '0.7rem',
    borderRadius: 8,
    border: '1px solid var(--color-cz-border2)',
    background: 'var(--color-cz-surface)',
    color: 'var(--color-cz-text)',
    fontFamily: 'var(--font-syne)',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
  } as React.CSSProperties,
  errorText: {
    fontSize: '0.825rem',
    color: 'var(--color-cz-red)',
    margin: 0,
    padding: '0.6rem 0.75rem',
    background: 'var(--color-cz-red-dim)',
    borderRadius: 6,
  } as React.CSSProperties,
}