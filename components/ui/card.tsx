import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentTop?: boolean
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ accentTop, className, hover, padding, ...props }: CardProps) {
  const paddings = { sm: 'p-4', md: 'p-5', lg: 'p-7' }
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-cz-border)] bg-[var(--color-cz-surface)]',
        accentTop && 'accent-top relative overflow-hidden',
        hover && 'transition hover:-translate-y-0.5 hover:border-[var(--color-cz-border2)]',
        padding && paddings[padding],
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 p-5 pb-3', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[var(--color-cz-muted)]', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-3', className)} {...props} />
}

export default Card
