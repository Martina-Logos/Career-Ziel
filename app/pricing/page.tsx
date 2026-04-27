import Link from 'next/link'
import AppShell from '@/components/ui/AppShell'

const FREE_FEATURES = [
  '3 text sessions per week',
  'Basic AI feedback',
  'Score tracking',
  'Limited question bank',
  'Voice input',
]

const PRO_FEATURES = [
  'Unlimited sessions',
  'Detailed PDF reports',
  'Advanced analytics dashboard',
  'CSV data export',
  'Priority AI response times',
  'Custom session configurations',
  'Video mock interviews',
  'Video playback with timestamps',
  'Job description upload (RAG)',
  'Multi-language support',
]

export default function PricingPage() {
  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: 'var(--color-cz-gold)' }}>Pricing</p>
          <h1 className="font-syne font-700 text-3xl tracking-tight mb-3" style={{ color: 'var(--color-cz-text)' }}>
            Simple, honest pricing
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-cz-muted)' }}>Start free. Upgrade when you're ready to go deeper.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div
            className="rounded-[var(--radius-xl)] p-7"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-border)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-cz-muted)' }}>Free</p>
            <p className="font-syne font-700 text-4xl mb-1" style={{ color: 'var(--color-cz-text)' }}>$0</p>
            <p className="text-sm mb-7" style={{ color: 'var(--color-cz-muted)' }}>Forever free · No card needed</p>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--color-cz-muted)' }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: 'var(--color-cz-teal)', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div
              className="w-full py-2.5 text-center rounded-[var(--radius-md)] text-sm font-syne font-600"
              style={{ background: 'var(--color-cz-surface2)', color: 'var(--color-cz-muted)', border: '1px solid var(--color-cz-border2)' }}
            >
              Current Plan
            </div>
          </div>

          {/* Pro */}
          <div
            className="rounded-[var(--radius-xl)] p-7 relative overflow-hidden"
            style={{ background: 'var(--color-cz-surface)', border: '1px solid var(--color-cz-gold-border)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, var(--color-cz-gold), var(--color-cz-gold-light))' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 0%, var(--color-cz-gold-dim), transparent 60%)' }} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-cz-muted)' }}>Pro</p>
                <span
                  className="text-[10px] font-syne font-600 px-2.5 py-0.5 rounded-full border uppercase"
                  style={{ background: 'var(--color-cz-gold-dim)', color: 'var(--color-cz-gold)', borderColor: 'var(--color-cz-gold-border)' }}
                >
                  Most Popular
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="font-syne font-700 text-4xl" style={{ color: 'var(--color-cz-text)' }}>$4.99</p>
                <span className="text-base" style={{ color: 'var(--color-cz-muted)' }}>/month</span>
              </div>
              <p className="text-sm mb-7" style={{ color: 'var(--color-cz-muted)' }}>or $49/year · Save 18%</p>

              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--color-cz-text)' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: 'var(--color-cz-gold)', flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="cz-btn cz-btn-primary w-full justify-center text-base py-3"
              >
                Start Free Trial →
              </Link>
              <p className="text-center text-xs mt-2" style={{ color: 'var(--color-cz-muted)' }}>
                14-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="font-syne font-600 text-lg mb-5" style={{ color: 'var(--color-cz-text)' }}>Full Comparison</h2>
          <div
            className="rounded-[var(--radius-lg)] overflow-hidden"
            style={{ border: '1px solid var(--color-cz-border)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-cz-surface2)', borderBottom: '1px solid var(--color-cz-border)' }}>
                  <th className="text-left p-4 font-syne font-600" style={{ color: 'var(--color-cz-text)' }}>Feature</th>
                  <th className="p-4 font-syne font-600 text-center" style={{ color: 'var(--color-cz-muted)' }}>Free</th>
                  <th className="p-4 font-syne font-600 text-center" style={{ color: 'var(--color-cz-gold-light)' }}>Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Text mock sessions', '3/week', 'Unlimited'],
                  ['AI feedback', 'Basic', 'Advanced'],
                  ['Video mocks', '—', '✓'],
                  ['PDF reports', '—', '✓'],
                  ['Analytics dashboard', 'Basic', 'Full'],
                  ['CSV export', '—', '✓'],
                  ['JD upload & parsing', '—', '✓'],
                  ['Multi-language', '—', '✓'],
                  ['Priority AI', '—', '✓'],
                ].map(([feature, free, pro], i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? 'var(--color-cz-surface)' : 'var(--color-cz-surface2)',
                      borderBottom: i < 8 ? '1px solid var(--color-cz-border)' : 'none',
                    }}
                  >
                    <td className="p-4" style={{ color: 'var(--color-cz-text)' }}>{feature}</td>
                    <td className="p-4 text-center" style={{ color: free === '—' ? 'var(--color-cz-subtle)' : 'var(--color-cz-muted)' }}>{free}</td>
                    <td className="p-4 text-center font-medium" style={{ color: pro === '✓' ? 'var(--color-cz-gold)' : 'var(--color-cz-text)' }}>{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}