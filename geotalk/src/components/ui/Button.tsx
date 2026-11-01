import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--gt-teal)] text-[#04120e] hover:brightness-110 shadow-[0_8px_24px_rgba(42,155,124,0.25)]',
  accent:
    'bg-[var(--gt-accent)] text-[#1a1408] hover:brightness-105 shadow-[0_8px_24px_rgba(224,179,90,0.22)]',
  secondary:
    'bg-[var(--gt-bg-3)] text-[var(--gt-text)] border border-[var(--gt-border)] hover:border-[var(--gt-border-strong)] hover:bg-[#223040]',
  ghost:
    'bg-transparent text-[var(--gt-text-muted)] hover:text-[var(--gt-text)] hover:bg-white/5',
  danger: 'bg-[rgba(226,109,109,0.15)] text-[var(--gt-danger)] hover:bg-[rgba(226,109,109,0.25)]',
}

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-base rounded-xl',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
