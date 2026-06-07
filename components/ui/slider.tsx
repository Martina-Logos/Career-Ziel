'use client'

import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[]
  onValueChange?: (value: number[]) => void
}

export function Slider({ className, max = 100, min = 0, onValueChange, step = 1, value = [0], ...props }: SliderProps) {
  return (
    <input
      type="range"
      className={cn('w-full accent-[var(--color-cz-burg)]', className)}
      min={min}
      max={max}
      step={step}
      value={value[0] ?? 0}
      onChange={(event) => onValueChange?.([Number(event.target.value)])}
      {...props}
    />
  )
}
