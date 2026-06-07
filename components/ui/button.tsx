'use client'

import Link from 'next/link'
import { ButtonHTMLAttributes, ReactElement, ReactNode, cloneElement, isValidElement } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'danger' | 'teal'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: ReactNode
  loading?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

const variants: Record<ButtonVariant, string> = {
  default: 'bg-[var(--color-cz-burg)] text-[var(--color-cz-bg)] hover:bg-[var(--color-cz-burg-hover)]',
  primary: 'bg-[var(--color-cz-burg)] text-[var(--color-cz-bg)] hover:bg-[var(--color-cz-burg-hover)]',
  secondary: 'bg-[var(--color-cz-surface2)] text-[var(--color-cz-text)] hover:bg-[var(--color-cz-surface3)]',
  outline: 'border border-[var(--color-cz-border2)] bg-transparent text-[var(--color-cz-text)] hover:bg-[var(--color-cz-surface2)]',
  ghost: 'bg-transparent text-[var(--color-cz-muted)] hover:bg-[var(--color-cz-surface2)] hover:text-[var(--color-cz-text)]',
  destructive: 'bg-[var(--color-cz-red)] text-white hover:opacity-90',
  danger: 'bg-[var(--color-cz-red-dim)] text-[var(--color-cz-red)] hover:bg-[var(--color-cz-red)]/20',
  teal: 'bg-[var(--color-cz-teal-dim)] text-[var(--color-cz-teal)] hover:bg-[var(--color-cz-teal-dim)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
}

export function Button({
  asChild,
  children,
  className,
  disabled,
  loading,
  size = 'md',
  variant = 'default',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold transition disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    sizes[size],
    className
  )

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; href?: string }>
    if (child.type === Link || typeof child.props.href === 'string') {
      return cloneElement(child, { className: cn(classes, child.props.className) })
    }
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
