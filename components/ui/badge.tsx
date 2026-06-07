import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'gold' | 'teal' | 'amber' | 'red' | 'gray' | 'olive' | 'behavioral' | 'technical' | 'general'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-[var(--color-cz-burg)] text-[var(--color-cz-bg)]',
  secondary: 'border-[var(--color-cz-border2)] bg-[var(--color-cz-surface2)] text-[var(--color-cz-muted)]',
  outline: 'border-[var(--color-cz-border2)] text-[var(--color-cz-text)]',
  destructive: 'border-transparent bg-[var(--color-cz-red-dim)] text-[var(--color-cz-red)]',
  gold: 'border-[var(--color-cz-gold-border)] bg-[var(--color-cz-gold-dim)] text-[var(--color-cz-gold-light)]',
  teal: 'border-[var(--color-cz-teal)]/25 bg-[var(--color-cz-teal-dim)] text-[var(--color-cz-teal)]',
  amber: 'border-[var(--color-cz-amber)]/25 bg-[var(--color-cz-amber-dim)] text-[var(--color-cz-amber)]',
  red: 'border-[var(--color-cz-red)]/25 bg-[var(--color-cz-red-dim)] text-[var(--color-cz-red)]',
  gray: 'border-[var(--color-cz-border2)] bg-[var(--color-cz-surface2)] text-[var(--color-cz-muted)]',
  olive: 'border-[#4D4937]/60 bg-[#4D4937]/30 text-[#b8b49a]',
  behavioral: 'border-[var(--color-cz-teal)]/25 bg-[var(--color-cz-teal-dim)] text-[var(--color-cz-teal)]',
  technical: 'border-[var(--color-cz-gold-border)] bg-[var(--color-cz-gold-dim)] text-[var(--color-cz-gold-light)]',
  general: 'border-[#4D4937]/60 bg-[#4D4937]/30 text-[#c4c0aa]',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}
      {...props}
    />
  )
}

export default Badge
