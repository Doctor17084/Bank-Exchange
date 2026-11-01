import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-[var(--gt-border)] bg-[var(--gt-bg-2)] px-3 text-[var(--gt-text)] outline-none transition placeholder:text-[var(--gt-text-faint)] focus:border-[rgba(42,155,124,0.55)] focus:ring-2 focus:ring-[rgba(42,155,124,0.2)]',
        className,
      )}
      {...props}
    />
  )
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[88px] w-full resize-y rounded-xl border border-[var(--gt-border)] bg-[var(--gt-bg-2)] px-3 py-2 text-[var(--gt-text)] outline-none transition placeholder:text-[var(--gt-text-faint)] focus:border-[rgba(42,155,124,0.55)] focus:ring-2 focus:ring-[rgba(42,155,124,0.2)]',
        className,
      )}
      {...props}
    />
  )
}
