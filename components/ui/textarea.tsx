import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-24 w-full rounded-md border border-[var(--color-cz-border2)] bg-[var(--color-cz-surface2)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-cz-burg)] focus:bg-[var(--color-cz-surface)] focus:ring-2 focus:ring-[var(--color-cz-burg-dim)] disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
