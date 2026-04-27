import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  accentTop?: boolean
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ children, accentTop, hover, padding = 'md', className, ...props }: CardProps) {
  const paddings = { sm: 'p-4', md: 'p-5', lg: 'p-7' }
  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden',
        accentTop && 'accent-top',
        hover && 'transition-all duration-200 hover:border-[var(--color-cz-border2)] hover:-translate-y-0.5 cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}