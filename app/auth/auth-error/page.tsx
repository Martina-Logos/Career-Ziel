// app/auth/auth-error/page.tsx
// Shown when the email verification link is broken or expired.

export default function AuthErrorPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
      background: 'var(--color-cz-bg)',
    }}>
      <div style={{
        maxWidth: 400, textAlign: 'center',
        background: 'var(--color-cz-surface)',
        border: '1px solid var(--color-cz-border2)',
        borderRadius: 14, padding: '2rem',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{
          fontFamily: 'var(--font-syne)', fontWeight: 700,
          fontSize: '1.3rem', color: 'var(--color-cz-text)',
          marginBottom: '0.75rem',
        }}>
          Link expired or invalid
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-cz-muted)', marginBottom: '1.5rem' }}>
          Your verification link has expired or has already been used.
          Try signing up again or request a new link.
        </p>
        <a
          href="/auth/signup"
          style={{
            display: 'block', padding: '0.75rem',
            borderRadius: 8, background: 'var(--color-cz-burg)',
            color: 'var(--color-cz-bg)', fontFamily: 'var(--font-syne)',
            fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem',
          }}
        >
          Back to sign up
        </a>
      </div>
    </div>
  )
}