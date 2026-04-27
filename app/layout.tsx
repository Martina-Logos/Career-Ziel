import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'CareerZiel — AI Interview Practice',
  description: 'Ace your next interview with AI-powered mock interviews, instant feedback, and progress analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-dm antialiased bg-cz-bg text-cz-text`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}