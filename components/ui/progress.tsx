import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const width = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-[var(--color-cz-surface2)]', className)} {...props}>
      <div className="h-full rounded-full bg-[var(--color-cz-burg)] transition-all" style={{ width: `${width}%` }} />
    </div>
  )
}
