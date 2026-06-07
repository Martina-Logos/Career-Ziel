'use client'

import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AlertDialog({ children, open }: { children: ReactNode; onOpenChange?: (open: boolean) => void; open?: boolean }) {
  return open ? <>{children}</> : null
}

export function AlertDialogContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className={cn('w-full max-w-md rounded-lg border border-[var(--color-cz-border)] bg-[var(--color-cz-surface)] p-6 shadow-xl', className)} {...props} />
    </div>
  )
}

export function AlertDialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2', className)} {...props} />
}

export function AlertDialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}

export function AlertDialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[var(--color-cz-muted)]', className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)} {...props} />
}

export function AlertDialogCancel({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn('rounded-md border border-[var(--color-cz-border2)] px-4 py-2 text-sm font-semibold', className)} {...props} />
}

export function AlertDialogAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn('rounded-md bg-[var(--color-cz-burg)] px-4 py-2 text-sm font-semibold text-[var(--color-cz-bg)]', className)} {...props} />
}
