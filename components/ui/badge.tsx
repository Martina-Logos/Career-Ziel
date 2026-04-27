import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'teal' | 'amber' | 'red' | 'gray' | 'olive' | 'behavioral' | 'technical' | 'general'

const variantStyles: Record<BadgeVariant, string> = {
  gold:       'bg-[var(--color-cz-gold-dim)] text-[var(--color-cz-gold-light)] border-[var(--color-cz-gold-border)]',
  teal:       'bg-[var(--color-cz-teal-dim)] text-[var(--color-cz-teal)] border-[var(--color-cz-teal)]/25',
  amber:      'bg-[var(--color-cz-amber-dim)] text-[var(--color-cz-amber)] border-[var(--color-cz-amber)]/25',
  red:        'bg-[var(--color-cz-red-dim)] text-[var(--color-cz-red)] border-[var(--color-cz-red)]/25',
  gray:       'bg-[var(--color-cz-surface2)] text-[var(--color-cz-muted)] border-[var(--color-cz-border2)]',
  olive:      'bg-[#4D4937]/30 text-[#b8b49a] border-[#4D4937]/60',
  behavioral: 'bg-[var(--color-cz-teal-dim)] text-[var(--color-cz-teal)] border-[var(--color-cz-teal)]/25',
  technical:  'bg-[var(--color-cz-gold-dim)] text-[var(--color-cz-gold-light)] border-[var(--color-cz-gold-border)]',
  general:    'bg-[#4D4937]/30 text-[#c4c0aa] border-[#4D4937]/60',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border uppercase',
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  )
}