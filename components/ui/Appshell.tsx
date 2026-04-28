'use client'
// components/layout/AppShell.tsx
// Sidebar navigation shell — pulls real user name, avatar, plan from Supabase.
// No mock data. Shows initials avatar if no avatar_url set.

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { signOut } from '@/app/auth/actions'

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: '⊞' },
  { href: '/practice',   label: 'Practice',   icon: '🎯' },
  { href: '/analytics',  label: 'Analytics',  icon: '📊' },
  { href: '/settings',   label: 'Settings',   icon: '⚙️' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Derive display values from real user data
  const displayName = user?.full_name ?? user?.email?.split('@')[0] ?? '...'
  const displayRole = user?.target_role ?? 'Set your target role'
  const plan = user?.plan ?? 'free'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cz-bg)' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--color-cz-surface)',
        borderRight: '1px solid var(--color-cz-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.2s ease',
      }}>

        {/* Logo */}
        <div style={{
          padding: '1.25rem 1.25rem 0.75rem',
          borderBottom: '1px solid var(--color-cz-border)',
        }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--color-cz-burg)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-cz-bg)',
              fontWeight: 700, fontSize: '0.8rem',
              flexShrink: 0,
            }}>CZ</div>
            <span style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--color-cz-text)',
            }}>Career Ziel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0.75rem 0.75rem', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 8,
                  marginBottom: '0.15rem',
                  textDecoration: 'none',
                  background: active ? 'var(--color-cz-burg-dim)' : 'transparent',
                  color: active ? 'var(--color-cz-burg)' : 'var(--color-cz-muted)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s',
                  borderLeft: active ? '2px solid var(--color-cz-burg)' : '2px solid transparent',
                }}
              >
                <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          {/* Pricing / upgrade link */}
          <Link
            href="/pricing"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.6rem 0.75rem',
              borderRadius: 8,
              marginBottom: '0.15rem',
              textDecoration: 'none',
              color: 'var(--color-cz-muted)',
              fontSize: '0.875rem',
              transition: 'all 0.15s',
              borderLeft: '2px solid transparent',
            }}
          >
            <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>💳</span>
            Pricing
          </Link>
        </nav>

        {/* Pro upgrade banner — only for free users */}
        {!loading && plan === 'free' && (
          <div style={{
            margin: '0 0.75rem 0.75rem',
            padding: '0.875rem',
            borderRadius: 10,
            background: 'var(--color-cz-burg-dim)',
            border: '1px solid var(--color-cz-burg-border)',
          }}>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--color-cz-burg)' }}>
              ✦ Unlock Pro
            </p>
            <p style={{ margin: '0 0 0.6rem', fontSize: '0.725rem', color: 'var(--color-cz-muted)', lineHeight: 1.4 }}>
              6 more personas, JD extractor, advanced analytics
            </p>
            <Link href="/pricing" style={{
              display: 'block', textAlign: 'center',
              padding: '0.4rem', borderRadius: 6,
              background: 'var(--color-cz-burg)',
              color: 'var(--color-cz-bg)',
              fontSize: '0.75rem', fontWeight: 600,
              textDecoration: 'none',
            }}>
              Upgrade →
            </Link>
          </div>
        )}

        {/* User section */}
        <div style={{
          padding: '0.875rem 1rem',
          borderTop: '1px solid var(--color-cz-border)',
        }}>
          {loading ? (
            <div style={{
              height: 40,
              borderRadius: 8,
              background: 'var(--color-cz-surface2)',
              animation: 'pulse 1.5s infinite',
            }}/>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Avatar */}
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={displayName}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--color-cz-burg)',
                  color: 'var(--color-cz-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {initials || '?'}
                </div>
              )}

              {/* Name + role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--color-cz-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {displayName}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '0.7rem',
                  color: 'var(--color-cz-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {displayRole}
                </p>
              </div>

              {/* Sign out */}
              <form action={signOut}>
                <button
                  type="submit"
                  title="Sign out"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.25rem',
                    color: 'var(--color-cz-muted)',
                    fontSize: '0.9rem',
                    borderRadius: 4,
                    flexShrink: 0,
                  }}
                >
                  ↪
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        minHeight: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
      }}>
        {children}
      </main>
    </div>
  )
}