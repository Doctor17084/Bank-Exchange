import type { Presence } from '../../types'
import { avatarGradient, cn, initials } from '../../lib/utils'

interface Props {
  name: string
  hue: number
  size?: number
  presence?: Presence
  className?: string
}

const presenceColor: Record<Presence, string> = {
  online: 'bg-[var(--gt-ok)] gt-presence-online',
  idle: 'bg-[var(--gt-accent)]',
  dnd: 'bg-[var(--gt-danger)]',
  offline: 'bg-[var(--gt-text-faint)]',
}

export function Avatar({ name, hue, size = 36, presence, className }: Props) {
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <div
        className="grid h-full w-full place-items-center rounded-full text-[0.7em] font-semibold text-white/95 ring-1 ring-white/10"
        style={{ background: avatarGradient(hue), fontSize: size * 0.34 }}
      >
        {initials(name)}
      </div>
      {presence ? (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--gt-bg-1)]',
            presenceColor[presence],
          )}
        />
      ) : null}
    </div>
  )
}
