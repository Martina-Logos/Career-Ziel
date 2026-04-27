import AppShell from '@/components/layout/AppShell'
import { ReactNode } from 'react'

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}