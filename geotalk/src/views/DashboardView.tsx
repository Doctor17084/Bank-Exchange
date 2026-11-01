import { ArrowRight, Hash, Headphones, MessageCircle } from 'lucide-react'
import { localized, t } from '../i18n/messages'
import { formatTime } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function DashboardView() {
  const locale = useAppStore((s) => s.locale)
  const servers = useAppStore((s) => s.servers)
  const channels = useAppStore((s) => s.channels)
  const messages = useAppStore((s) => s.messages)
  const users = useAppStore((s) => s.users)
  const selectServer = useAppStore((s) => s.selectServer)
  const selectChannel = useAppStore((s) => s.selectChannel)
  const selectDm = useAppStore((s) => s.selectDm)
  const setView = useAppStore((s) => s.setView)
  const voice = useAppStore((s) => s.voice)
  const dmThreads = useAppStore((s) => s.dmThreads)

  const recent = [...messages]
    .filter((m) => !m.channelId.startsWith('dm-'))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <section className="relative mb-8 overflow-hidden rounded-[28px] border border-[var(--gt-border)]">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_15%_0%,rgba(42,155,124,0.28),transparent_55%),radial-gradient(700px_380px_at_90%_20%,rgba(224,179,90,0.18),transparent_50%),linear-gradient(135deg,#0b1210,#0c1520_60%,#0a1014)]" />
        <div className="gt-grid-noise absolute inset-0 opacity-40" />
        <div className="relative px-8 py-10 md:px-12 md:py-14">
          <Badge tone="accent" className="mb-4">
            {t(locale, 'brand')}
          </Badge>
          <h1
            className="gt-animate-in max-w-2xl text-4xl font-extrabold tracking-tight text-[var(--gt-text)] md:text-5xl"
            style={{ fontFamily: 'var(--gt-font-display)' }}
          >
            {t(locale, 'homeHero')}
          </h1>
          <p className="gt-animate-in gt-animate-delay-1 mt-3 max-w-xl text-base text-[var(--gt-text-muted)] md:text-lg">
            {t(locale, 'homeSub')}
          </p>
          <div className="gt-animate-in gt-animate-delay-2 mt-6 flex flex-wrap gap-3">
            <Button variant="accent" onClick={() => selectServer(servers[0]?.id ?? 's-geotalk')}>
              {t(locale, 'quickJump')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => setView('ai')}>
              {t(locale, 'ai')}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="gt-animate-in gt-animate-delay-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
            {t(locale, 'quickJump')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {servers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => selectServer(s.id)}
                className="rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-4 text-left transition hover:border-[var(--gt-border-strong)] hover:bg-[rgba(26,36,48,0.7)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-[#04120e]"
                    style={{ background: s.accent }}
                  >
                    {s.iconLetter}
                  </span>
                  <div>
                    <div className="font-semibold">{localized(locale, s.name, s.nameKa)}</div>
                    <div className="text-xs text-[var(--gt-text-faint)]">
                      {s.memberIds.length} {t(locale, 'members')}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--gt-text-muted)]">
                  {localized(locale, s.description, s.descriptionKa)}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="gt-animate-in gt-animate-delay-2 space-y-4">
          <div className="rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
              {t(locale, 'activeVoice')}
            </h2>
            {voice.channelId ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Headphones className="h-4 w-4 text-[var(--gt-teal)]" />
                  {localized(
                    locale,
                    channels.find((c) => c.id === voice.channelId)?.name ?? 'voice',
                    channels.find((c) => c.id === voice.channelId)?.nameKa ?? 'ხმა',
                  )}
                </div>
                <Button size="sm" variant="primary" onClick={() => setView('voice')}>
                  {t(locale, 'openChannel')}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => selectChannel('c-voice-lobby')}
              >
                {t(locale, 'startVoice')}
              </Button>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
              {t(locale, 'dms')}
            </h2>
            <div className="space-y-2">
              {dmThreads.map((dm) => {
                const otherId = dm.participantIds.find((id) => id !== useAppStore.getState().session?.userId)
                const other = users.find((u) => u.id === otherId)
                return (
                  <button
                    key={dm.id}
                    type="button"
                    onClick={() => selectDm(dm.id)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <MessageCircle className="h-4 w-4 text-[var(--gt-accent)]" />
                      {other
                        ? localized(locale, other.displayName, other.displayNameKa)
                        : dm.id}
                    </span>
                    {dm.unread ? <Badge tone="accent">{dm.unread}</Badge> : null}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      <section className="gt-animate-in gt-animate-delay-3 mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
          {t(locale, 'recentActivity')}
        </h2>
        <div className="space-y-2">
          {recent.map((m) => {
            const author = users.find((u) => u.id === m.authorId)
            const channel = channels.find((c) => c.id === m.channelId)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => channel && selectChannel(channel.id)}
                className="flex w-full items-start gap-3 rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.4)] px-4 py-3 text-left transition hover:bg-[rgba(26,36,48,0.55)]"
              >
                <Hash className="mt-1 h-4 w-4 text-[var(--gt-text-faint)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[var(--gt-text-faint)]">
                    {author
                      ? localized(locale, author.displayName, author.displayNameKa)
                      : '—'}{' '}
                    · #{channel ? localized(locale, channel.name, channel.nameKa) : '…'} ·{' '}
                    {formatTime(m.createdAt, locale)}
                  </div>
                  <div className="truncate text-sm">
                    {localized(locale, m.content, m.contentKa ?? m.content)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
