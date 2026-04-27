import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[var(--color-cz-muted)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'cz-input',
            error && 'border-[var(--color-cz-red)]/50 focus:border-[var(--color-cz-red)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-cz-red)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--color-cz-muted)]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input