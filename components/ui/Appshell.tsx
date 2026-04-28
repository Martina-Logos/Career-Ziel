'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { signOut } from '@/app/auth/actions'

interface NavItem {
  href: string
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/practice',
    label: 'Practice',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useApp()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[var(--color-cz-border)] flex flex-col bg-[var(--color-cz-surface)] sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[var(--color-cz-border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cz-violet)] flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-syne font-700 text-base tracking-tight">CareerZiel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-[var(--color-cz-violet-dim)] text-[var(--color-cz-violet-light)]'
                    : 'text-[var(--color-cz-muted)] hover:text-[var(--color-cz-text)] hover:bg-[var(--color-cz-surface2)]'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </nav>

        {/* Pro upgrade banner */}
        {user?.tier === 'free' && (
          <div className="mx-3 mb-3 p-3.5 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-cz-violet-dim)] to-[var(--color-cz-teal-dim)] border border-[var(--color-cz-violet)]/20">
            <p className="text-xs font-syne font-600 mb-0.5">Upgrade to Pro</p>
            <p className="text-[11px] text-[var(--color-cz-muted)] mb-2.5">Unlimited sessions + video mocks</p>
            <Link
              href="/pricing"
              className="block text-center text-[11px] font-syne font-600 py-1.5 bg-[var(--color-cz-violet)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-cz-violet-light)] transition-colors"
            >
              View Plans →
            </Link>
          </div>
        )}

        {/* User */}
        <div className="px-4 py-4 border-t border-[var(--color-cz-border)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-cz-violet-dim)] flex items-center justify-center text-xs font-syne font-600 text-[var(--color-cz-violet-light)] shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'GU'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
            <p className="text-[11px] text-[var(--color-cz-muted)] truncate capitalize">{user?.tier || 'free'} tier</p>
          </div>
          <button
            onClick={logout}
            className="text-[var(--color-cz-muted)] hover:text-[var(--color-cz-text)] transition-colors"
            title="Logout"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}