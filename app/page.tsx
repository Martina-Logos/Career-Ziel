import Image from 'next/image'
import Link from 'next/link'

const features = [
  {
    title: 'AI Mock Interviews',
    desc: 'Realistic questions tailored to your target role and industry, powered by Claude AI.',
  },
  {
    title: 'Personalized Questions',
    desc: 'Paste a job description and get questions crafted from the actual requirements.',
  },
  {
    title: 'Deep Analytics',
    desc: 'Track clarity, confidence, relevance and technical accuracy across sessions.',
  },
  {
    title: 'Progress Tracking',
    desc: 'See your improvement over time with score trends and skill mastery bars.',
  },
  {
    title: 'Voice Input',
    desc: 'Answer questions by speaking naturally — just like a real interview.',
  },
  {
    title: 'Instant Feedback',
    desc: 'Get detailed AI feedback on every answer with actionable suggestions.',
  },
]

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Software Engineer at Google',
    text: 'CareerZiel helped me go from failing phone screens to landing my dream job. The AI feedback is incredibly specific.',
    score: '+34pts',
  },
  {
    name: 'David M.',
    role: 'Product Manager at Stripe',
    text: 'I practiced every day for 2 weeks. The personalized questions matched almost exactly what I was asked in real interviews.',
    score: '+41pts',
  },
  {
    name: 'Amara N.',
    role: 'Data Scientist at Meta',
    text: 'The analytics dashboard showed exactly where I was weak. I focused on technical accuracy and crushed it.',
    score: '+28pts',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cz-bg)]">
      {/* Top nav */}
      <header className="border-b border-[var(--color-cz-border)] px-8 py-4 flex items-center justify-between sticky top-0 bg-[var(--color-cz-bg)]/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2.5">
<div className="w-8 h-8 relative overflow-hidden rounded-lg">
  <Image
    src="/CareerZiel.png"
    alt="CareerZiel logo"
    fill
    className="object-cover"
  />
</div>
          <span className="font-syne font-bold text-lg tracking-tight">CareerZiel</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-cz-muted)]">
          <a href="#features" className="hover:text-[var(--color-cz-text)] transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-[var(--color-cz-text)] transition-colors">Reviews</a>
          <a href="#pricing" className="hover:text-[var(--color-cz-text)] transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="cz-btn cz-btn-ghost text-sm px-4 py-2">Sign In</Link>
          <Link href="/auth/signup" className="cz-btn cz-btn-primary text-sm px-5 py-2">Get Started Free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 pt-24 pb-20 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-cz-violet)]/30 bg-[var(--color-cz-violet-dim)] text-xs font-medium text-[var(--color-cz-violet-light)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cz-violet-light)] animate-pulse" />
          Career Ziel
        </div>
        <h1 className="font-syne font-800 text-5xl md:text-7xl leading-[1.05] tracking-tighter mb-6">
          Ace Your Next<br />
          <span className="gradient-text">Interview</span>
        </h1>
        <p className="text-lg text-[var(--color-cz-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
          Practice with AI-powered mock interviews tailored to your role. Get instant feedback, track your progress, and walk into every interview with confidence.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/signup" className="cz-btn cz-btn-primary text-base px-8 py-3.5">
            Start Free Practice →
          </Link>
          <Link href="/auth/login" className="cz-btn cz-btn-secondary text-base px-8 py-3.5">
            Sign In
          </Link>
        </div>
        <p className="mt-5 text-xs text-[var(--color-cz-muted)]">No credit card required · 3 free sessions/week</p>

        {/* Hero visual */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-cz-bg)] z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="glass-card accent-top max-w-3xl mx-auto p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[var(--color-cz-teal)] animate-pulse" />
              <span className="text-xs text-[var(--color-cz-muted)] font-medium uppercase tracking-wider">Live Session · Software Engineer · Mid-level</span>
            </div>
            <div className="space-y-4">
              <div className="bg-[var(--color-cz-surface2)] rounded-[var(--radius-md)] p-4">
                <p className="text-xs text-[var(--color-cz-muted)] mb-2 uppercase tracking-wider">Question 2 of 5 · Behavioral</p>
                <p className="text-base font-syne font-600">Describe a time when you had to refactor a large codebase. What was your approach and what challenges did you face?</p>
              </div>
              <div className="text-sm text-[var(--color-cz-text)] leading-relaxed opacity-70">
                "In my previous role, we had a monolithic Node.js application that had grown to over 150k lines of code. I started by identifying the core domains using dependency analysis..."
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--color-cz-surface3)] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-cz-violet)] to-[var(--color-cz-teal)]" style={{ width: '40%' }} />
                </div>
                <span className="text-xs text-[var(--color-cz-muted)]">2 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-[var(--color-cz-violet-light)] uppercase tracking-widest mb-3 font-medium">Why CareerZiel</p>
          <h2 className="font-syne font-700 text-3xl md:text-4xl tracking-tight">Everything you need to prepare</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-5 hover:border-[var(--color-cz-border2)] transition-all duration-200 hover:-translate-y-0.5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-syne font-600 text-base mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--color-cz-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-8 py-20 bg-[var(--color-cz-surface)]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-[var(--color-cz-teal)] uppercase tracking-widest mb-3 font-medium">Success Stories</p>
            <h2 className="font-syne font-700 text-3xl md:text-4xl tracking-tight">Real results from real people</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-cz-violet-dim)] flex items-center justify-center font-syne font-600 text-sm text-[var(--color-cz-violet-light)]">
                    {t.name.slice(0, 2)}
                  </div>
                  <span className="text-sm font-syne font-600 text-[var(--color-cz-teal)]">{t.score}</span>
                </div>
                <p className="text-sm text-[var(--color-cz-muted)] leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-[var(--color-cz-muted)]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="px-8 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-[var(--color-cz-amber)] uppercase tracking-widest mb-3 font-medium">Simple Pricing</p>
          <h2 className="font-syne font-700 text-3xl md:text-4xl tracking-tight">Start free, upgrade when ready</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="glass-card p-7">
            <p className="text-xs text-[var(--color-cz-muted)] uppercase tracking-wider mb-1">Free</p>
            <p className="font-syne font-700 text-4xl mb-1">$0</p>
            <p className="text-sm text-[var(--color-cz-muted)] mb-6">Forever free</p>
            <ul className="space-y-3 text-sm mb-8">
              {['3 text sessions per week', 'Basic feedback', 'Limited question bank', 'Score tracking'].map(f => (
                <li key={f} className="flex items-center gap-2 text-[var(--color-cz-muted)]">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-[var(--color-cz-teal)] shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className="cz-btn cz-btn-secondary w-full text-center justify-center">Get Started Free</Link>
          </div>
          <div className="glass-card accent-top p-7 border-[var(--color-cz-violet)]/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-[var(--color-cz-muted)] uppercase tracking-wider">Pro</p>
              <span className="text-[10px] bg-[var(--color-cz-violet-dim)] text-[var(--color-cz-violet-light)] px-2 py-0.5 rounded-full border border-[var(--color-cz-violet)]/20 uppercase font-medium">Most Popular</span>
            </div>
            <p className="font-syne font-700 text-4xl mb-1">$4.99<span className="text-lg text-[var(--color-cz-muted)]">/mo</span></p>
            <p className="text-sm text-[var(--color-cz-muted)] mb-6">or $49/year</p>
            <ul className="space-y-3 text-sm mb-8">
              {['Unlimited sessions', 'Detailed PDF reports', 'Video playback', 'CSV data export', 'Priority AI responses', 'Custom configurations'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-[var(--color-cz-teal)] shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className="cz-btn cz-btn-primary w-full text-center justify-center">Start Free Trial →</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-8 py-16 max-w-4xl mx-auto text-center">
        <div className="glass-card p-10 border-[var(--color-cz-violet)]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cz-violet-dim)] to-transparent pointer-events-none" />
          <h2 className="font-syne font-800 text-3xl md:text-4xl tracking-tight mb-4 relative z-10">Ready to start practicing?</h2>
          <p className="text-[var(--color-cz-muted)] mb-8 relative z-10">Join thousands of professionals who use CareerZiel to land their next role.</p>
          <Link href="/auth/signup" className="cz-btn cz-btn-primary text-base px-10 py-3.5 relative z-10">
            Start Practicing Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-cz-border)] px-8 py-8 text-center text-xs text-[var(--color-cz-muted)]">
        <p>© 2025 CareerZiel · Built with AI · <a href="#" className="hover:text-[var(--color-cz-text)]">Privacy</a> · <a href="#" className="hover:text-[var(--color-cz-text)]">Terms</a></p>
      </footer>
    </div>
  )
}