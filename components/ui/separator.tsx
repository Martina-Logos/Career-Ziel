import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <div
      className={cn(
        orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
        'bg-[var(--color-cz-border)]',
        className
      )}
      {...props}
    />
  )
}
