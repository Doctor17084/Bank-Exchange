import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: ReactNode
  tone?: 'muted' | 'accent' | 'teal' | 'danger'
  className?: string
}) {
  const tones = {
    muted: 'bg-white/5 text-[var(--gt-text-muted)]',
    accent: 'bg-[var(--gt-accent-soft)] text-[var(--gt-accent)]',
    teal: 'bg-[var(--gt-teal-soft)] text-[var(--gt-teal)]',
    danger: 'bg-[rgba(226,109,109,0.15)] text-[var(--gt-danger)]',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
