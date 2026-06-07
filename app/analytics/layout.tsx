// app/analytics/layout.tsx
import AppShell from '@/components/ui/AppShell'
import { ReactNode } from 'react'

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
