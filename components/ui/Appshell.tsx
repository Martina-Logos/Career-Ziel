'use client'
// components/layout/AppShell.tsx
// Collapsible sidebar — works on all screen sizes.
// Desktop: icon-only collapsed (64px) or full (240px), toggled by button.
// Mobile: off-canvas overlay, toggled by hamburger.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { signOut } from '@/app/auth/actions'

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard', icon: 'DB' },
  { href: '/practice',   label: 'Practice',  icon: 'PR' },
  { href: '/analytics',  label: 'Analytics', icon: 'AN' },
  { href: '/settings',   label: 'Settings',  icon: 'ST' },
  { href: '/pricing',    label: 'Pricing',   icon: '$' },
]

const SIDEBAR_FULL   = 240
const SIDEBAR_ICON   = 64

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname          = usePathname()
  const { user, loading } = useUser()

  // Desktop: collapsed = icon-only rail
  const [collapsed, setCollapsed] = useState(false)
  // Mobile: open = overlay visible
  const [mobileOpen, setMobileOpen] = useState(false)
  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const displayName = user?.full_name ?? user?.email?.split('@')[0] ?? '...'
  const displayRole = user?.target_role ?? 'Set your target role'
  const plan        = user?.plan ?? 'free'
  const initials    = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  const sidebarWidth = isMobile ? SIDEBAR_FULL : collapsed ? SIDEBAR_ICON : SIDEBAR_FULL
  const showLabels   = isMobile ? true : !collapsed

  const sidebar = (
    <aside style={{
      width: sidebarWidth,
      flexShrink: 0,
      background: 'var(--color-cz-surface)',
      borderRight: '1px solid var(--color-cz-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: isMobile ? (mobileOpen ? 0 : -SIDEBAR_FULL) : 0,
      zIndex: 50,
      transition: 'width 0.22s ease, left 0.22s ease',
      overflow: 'hidden',
    }}>

      {/* ── Logo row ── */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--color-cz-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
        gap: '0.5rem',
        minHeight: 60,
      }}>
        {/* Logo mark — always shown */}
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--color-cz-burg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-cz-bg)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
          }}>CZ</div>
          {showLabels && (
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-cz-text)', whiteSpace: 'nowrap' }}>
              Career Ziel
            </span>
          )}
        </Link>

        {/* Toggle button */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-cz-muted)', fontSize: '1rem',
              padding: '0.25rem', borderRadius: 6, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {collapsed ? '→' : '←'}
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-cz-muted)', fontSize: '1.2rem', padding: '0.25rem', borderRadius: 6 }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ padding: '0.6rem 0.5rem', flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!showLabels ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: showLabels ? 'flex-start' : 'center',
                gap: showLabels ? '0.6rem' : 0,
                padding: showLabels ? '0.6rem 0.75rem' : '0.7rem',
                borderRadius: 8,
                marginBottom: '0.1rem',
                textDecoration: 'none',
                background: active ? 'var(--color-cz-burg-dim)' : 'transparent',
                color: active ? 'var(--color-cz-burg)' : 'var(--color-cz-muted)',
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem',
                transition: 'all 0.15s',
                borderLeft: showLabels ? (active ? '2px solid var(--color-cz-burg)' : '2px solid transparent') : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              {showLabels && item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── Pro upgrade banner — full width only ── */}
      {showLabels && !loading && plan === 'free' && (
        <div style={{
          margin: '0 0.75rem 0.75rem',
          padding: '0.875rem',
          borderRadius: 10,
          background: 'var(--color-cz-burg-dim)',
          border: '1px solid var(--color-cz-burg-border)',
        }}>
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--color-cz-burg)' }}>✦ Unlock Pro</p>
          <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', color: 'var(--color-cz-muted)', lineHeight: 1.4 }}>
            6 more personas, JD extractor, advanced analytics
          </p>
          <Link href="/pricing" style={{
            display: 'block', textAlign: 'center', padding: '0.4rem',
            borderRadius: 6, background: 'var(--color-cz-burg)',
            color: 'var(--color-cz-bg)', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
          }}>
            Upgrade →
          </Link>
        </div>
      )}

      {/* ── User section ── */}
      <div style={{
        padding: showLabels ? '0.875rem 1rem' : '0.875rem 0.5rem',
        borderTop: '1px solid var(--color-cz-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: showLabels ? 'flex-start' : 'center',
        gap: '0.6rem',
      }}>
        {loading ? (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-cz-surface2)', flexShrink: 0 }}/>
        ) : (
          <>
            {/* Avatar */}
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={displayName}
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}/>
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--color-cz-burg)', color: 'var(--color-cz-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
              }}>
                {initials || '?'}
              </div>
            )}

            {showLabels && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-cz-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayName}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-cz-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayRole}
                  </p>
                </div>
                <form action={signOut}>
                  <button type="submit" title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--color-cz-muted)', fontSize: '0.9rem', borderRadius: 4, flexShrink: 0 }}>
                    ↪
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  )

  const mainMargin = isMobile ? 0 : collapsed ? SIDEBAR_ICON : SIDEBAR_FULL

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cz-bg)' }}>
      {sidebar}

      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        marginLeft: mainMargin,
        minHeight: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        transition: 'margin-left 0.22s ease',
      }}>
        {/* Mobile top bar with hamburger */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-cz-border)',
          }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--color-cz-text)', padding: '0.25rem', borderRadius: 6 }}
            >
              ☰
            </button>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-cz-text)' }}>Career Ziel</span>
          </div>
        )}

        {children}
      </main>
    </div>
  )
}
