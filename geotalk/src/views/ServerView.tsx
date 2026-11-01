import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { ChatPanel } from '../components/chat/ChatPanel'
import { Avatar } from '../components/ui/Avatar'

export function ServerView() {
  const locale = useAppStore((s) => s.locale)
  const servers = useAppStore((s) => s.servers)
  const channels = useAppStore((s) => s.channels)
  const users = useAppStore((s) => s.users)
  const activeServerId = useAppStore((s) => s.activeServerId)
  const activeChannelId = useAppStore((s) => s.activeChannelId)

  const server = servers.find((s) => s.id === activeServerId)
  const channel = channels.find((c) => c.id === activeChannelId)
  const members = users.filter((u) => server?.memberIds.includes(u.id))

  if (!server || !channel || channel.kind === 'voice') {
    return (
      <div className="grid h-full place-items-center text-[var(--gt-text-muted)]">
        {t(locale, 'channels')}
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="min-w-0 flex-1">
        <ChatPanel
          channelId={channel.id}
          title={`# ${localized(locale, channel.name, channel.nameKa)}`}
          subtitle={
            channel.topic
              ? localized(locale, channel.topic, channel.topicKa ?? channel.topic)
              : localized(locale, server.description, server.descriptionKa)
          }
        />
      </div>
      <aside className="gt-scroll hidden w-60 shrink-0 overflow-y-auto border-l border-[var(--gt-border)] p-4 xl:block">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
          {t(locale, 'members')} — {members.length}
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5">
              <Avatar
                name={localized(locale, m.displayName, m.displayNameKa)}
                hue={m.avatarHue}
                presence={m.presence}
                size={32}
              />
              <div className="min-w-0">
                <div className="truncate text-sm">
                  {localized(locale, m.displayName, m.displayNameKa)}
                </div>
                <div className="truncate text-[11px] text-[var(--gt-text-faint)]">
                  {t(locale, m.presence)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
