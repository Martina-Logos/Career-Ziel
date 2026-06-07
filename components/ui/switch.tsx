'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({ checked = false, className, onCheckedChange, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      aria-checked={checked}
      role="switch"
      className={cn('relative h-6 w-11 rounded-full transition', checked ? 'bg-[var(--color-cz-burg)]' : 'bg-[var(--color-cz-surface3)]', className)}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white transition', checked ? 'left-6' : 'left-1')} />
    </button>
  )
}
