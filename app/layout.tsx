import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'

export const metadata: Metadata = {
  icons: '/CareerZiel.png',
  title: 'CareerZiel — AI Interview Practice',
  description: 'Ace your next interview with AI-powered mock interviews, instant feedback, and progress analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-dm antialiased bg-cz-bg text-cz-text">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
