'use client'

import { createContext, ReactNode, SelectHTMLAttributes, useContext } from 'react'
import { cn } from '@/lib/utils'

const SelectContext = createContext<{ value?: string; onValueChange?: (value: never) => void }>({})

export function Select<T extends string = string>({ children, onValueChange, value }: { children: ReactNode; onValueChange?: (value: T) => void; value?: T }) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>
}

export function SelectTrigger({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const { onValueChange, value } = useContext(SelectContext)
  return (
    <select
      id={id}
      className={cn('h-10 w-full rounded-md border border-[var(--color-cz-border2)] bg-[var(--color-cz-surface2)] px-3 text-sm outline-none focus:border-[var(--color-cz-burg)]', className)}
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {children}
    </select>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return placeholder ? <option value="">{placeholder}</option> : null
}

export function SelectContent({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function SelectItem({ children, value }: SelectHTMLAttributes<HTMLOptionElement> & { children: ReactNode; value: string }) {
  return <option value={value}>{children}</option>
}
