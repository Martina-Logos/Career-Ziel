import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'teal'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'cz-btn'
  const variants = {
    primary: 'cz-btn-primary',
    secondary: 'cz-btn-secondary',
    ghost: 'cz-btn-ghost',
    danger: 'bg-[var(--color-cz-red-dim)] text-[var(--color-cz-red)] border border-[var(--color-cz-red)]/25 hover:bg-[var(--color-cz-red)]/20',
    teal: 'bg-[var(--color-cz-teal-dim)] text-[var(--color-cz-teal)] border border-[var(--color-cz-teal)]/25 hover:bg-[var(--color-cz-teal)]/20',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  )
}