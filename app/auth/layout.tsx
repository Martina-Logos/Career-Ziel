import { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-[var(--color-cz-surface)] border-r border-[var(--color-cz-border)] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-cz-violet)]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-cz-teal)]/8 blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-cz-violet)] flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-syne font-bold text-xl tracking-tight">CareerZiel</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-syne font-800 text-4xl leading-tight tracking-tighter mb-4">
            Practice smarter.<br />
            <span className="gradient-text">Interview better.</span>
          </h2>
          <p className="text-[var(--color-cz-muted)] text-base leading-relaxed mb-10 max-w-sm">
            AI-powered interview practice tailored to your role, industry, and experience level.
          </p>

          <div className="space-y-4">
            {[
              { text: 'Instant AI feedback on every answer' },
              { text: 'Track progress across sessions' },
              { text: 'Questions from real job descriptions' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span className="text-sm text-[var(--color-cz-muted)]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--color-cz-muted)] relative z-10">Trusted by 10,000+ job seekers worldwide</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}