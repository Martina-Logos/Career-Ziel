'use client'

import { ButtonHTMLAttributes, HTMLAttributes, ReactNode, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const CollapsibleContext = createContext<{ open?: boolean; onOpenChange?: (open: boolean) => void }>({})

export function Collapsible({ children, onOpenChange, open }: { children: ReactNode; onOpenChange?: (open: boolean) => void; open?: boolean }) {
  return <CollapsibleContext.Provider value={{ open, onOpenChange }}>{children}</CollapsibleContext.Provider>
}

export function CollapsibleTrigger({ className, onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange, open } = useContext(CollapsibleContext)
  return (
    <button
      type="button"
      className={cn('text-left', className)}
      onClick={(event) => {
        onOpenChange?.(!open)
        onClick?.(event)
      }}
      {...props}
    />
  )
}

export function CollapsibleContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(CollapsibleContext)
  if (!open) return null
  return <div className={className} {...props} />
}
