// app/pricing/layout.tsx
import AppShell from '@/components/ui/AppShell'
import { ReactNode } from 'react'
export default function Layout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}