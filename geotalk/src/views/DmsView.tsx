import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { ChatPanel } from '../components/chat/ChatPanel'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'

export function DmsView() {
  const locale = useAppStore((s) => s.locale)
  const dmThreads = useAppStore((s) => s.dmThreads)
  const users = useAppStore((s) => s.users)
  const session = useAppStore((s) => s.session)
  const activeDmId = useAppStore((s) => s.activeDmId)
  const selectDm = useAppStore((s) => s.selectDm)

  const active = dmThreads.find((d) => d.id === activeDmId) ?? dmThreads[0]
  const otherId = active?.participantIds.find((id) => id !== session?.userId)
  const other = users.find((u) => u.id === otherId)

  return (
    <div className="flex h-full min-h-0">
      <aside className="gt-scroll w-64 shrink-0 overflow-y-auto border-r border-[var(--gt-border)] p-3">
        <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
          {t(locale, 'dms')}
        </h2>
        {dmThreads.length === 0 ? (
          <p className="px-2 text-sm text-[var(--gt-text-faint)]">{t(locale, 'emptyDms')}</p>
        ) : (
          <div className="space-y-1">
            {dmThreads.map((dm) => {
              const oid = dm.participantIds.find((id) => id !== session?.userId)
              const u = users.find((x) => x.id === oid)
              const selected = active?.id === dm.id
              return (
                <button
                  key={dm.id}
                  type="button"
                  onClick={() => selectDm(dm.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
                    selected ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {u ? (
                    <Avatar
                      name={localized(locale, u.displayName, u.displayNameKa)}
                      hue={u.avatarHue}
                      presence={u.presence}
                      size={34}
                    />
                  ) : null}
                  <span className="flex-1 truncate text-sm">
                    {u ? localized(locale, u.displayName, u.displayNameKa) : dm.id}
                  </span>
                  {dm.unread ? <Badge tone="accent">{dm.unread}</Badge> : null}
                </button>
              )
            })}
          </div>
        )}
      </aside>
      <div className="min-w-0 flex-1">
        {active && other ? (
          <ChatPanel
            channelId={active.id}
            title={localized(locale, other.displayName, other.displayNameKa)}
            subtitle={localized(locale, other.status, other.statusKa)}
          />
        ) : (
          <div className="grid h-full place-items-center text-[var(--gt-text-muted)]">
            {t(locale, 'emptyDms')}
          </div>
        )}
      </div>
    </div>
  )
}
