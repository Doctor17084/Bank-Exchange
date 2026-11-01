import { Plus } from 'lucide-react'
import { localized, t } from '../../i18n/messages'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

export function ServerRail() {
  const locale = useAppStore((s) => s.locale)
  const servers = useAppStore((s) => s.servers)
  const activeServerId = useAppStore((s) => s.activeServerId)
  const selectServer = useAppStore((s) => s.selectServer)
  const setView = useAppStore((s) => s.setView)
  const setCreateServerOpen = useAppStore((s) => s.setCreateServerOpen)
  const view = useAppStore((s) => s.view)

  return (
    <aside className="flex w-[72px] shrink-0 flex-col items-center gap-2 border-r border-[var(--gt-border)] bg-[rgba(7,10,15,0.85)] py-3">
      <button
        type="button"
        onClick={() => setView('dashboard')}
        className={cn(
          'gt-brand-mark grid h-12 w-12 place-items-center rounded-2xl bg-[var(--gt-bg-3)] text-lg font-bold tracking-tight transition-all duration-300',
          view === 'dashboard'
            ? 'rounded-xl bg-[var(--gt-accent)] text-[#1a1408]'
            : 'text-[var(--gt-accent)] hover:rounded-xl hover:bg-[var(--gt-accent-soft)]',
        )}
        title={t(locale, 'brand')}
        style={{ fontFamily: 'var(--gt-font-display)' }}
      >
        G
      </button>
      <div className="my-1 h-px w-8 bg-[var(--gt-border)]" />
      <div className="gt-scroll flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto px-2">
        {servers.map((server, i) => {
          const active = activeServerId === server.id && view === 'server'
          return (
            <button
              key={server.id}
              type="button"
              onClick={() => selectServer(server.id)}
              className={cn(
                'gt-nav-item-enter relative grid h-12 w-12 place-items-center rounded-2xl text-sm font-semibold transition-all duration-300',
                active
                  ? 'rounded-xl text-[#04120e]'
                  : 'bg-[var(--gt-bg-3)] text-[var(--gt-text)] hover:rounded-xl',
              )}
              style={{
                background: active ? server.accent : undefined,
                animationDelay: `${i * 40}ms`,
              }}
              title={localized(locale, server.name, server.nameKa)}
            >
              {active ? (
                <span className="absolute -left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-[var(--gt-text)]" />
              ) : null}
              {server.iconLetter}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setCreateServerOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-dashed border-[var(--gt-border-strong)] text-[var(--gt-teal)] transition hover:rounded-xl hover:bg-[var(--gt-teal-soft)]"
          title={t(locale, 'createServer')}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}
