import AppShell from '@/components/ui/AppShell'
import { ReactNode } from 'react'

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}