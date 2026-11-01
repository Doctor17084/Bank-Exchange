import { Hash, MessageCircle, User } from 'lucide-react'
import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function SearchView() {
  const locale = useAppStore((s) => s.locale)
  const searchQuery = useAppStore((s) => s.searchQuery)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)
  const users = useAppStore((s) => s.users)
  const channels = useAppStore((s) => s.channels)
  const messages = useAppStore((s) => s.messages)
  const selectChannel = useAppStore((s) => s.selectChannel)
  const setView = useAppStore((s) => s.setView)
  const q = searchQuery.trim().toLowerCase()

  const userHits = q
    ? users.filter(
        (u) =>
          u.username.includes(q) ||
          u.displayName.toLowerCase().includes(q) ||
          u.displayNameKa.includes(searchQuery.trim()),
      )
    : []
  const channelHits = q
    ? channels.filter(
        (c) => c.name.includes(q) || c.nameKa.includes(searchQuery.trim()),
      )
    : []
  const messageHits = q
    ? messages
        .filter(
          (m) =>
            m.content.toLowerCase().includes(q) ||
            (m.contentKa ?? '').includes(searchQuery.trim()),
        )
        .slice(0, 12)
    : []

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <h1 className="mb-4 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'search')}
      </h1>
      <Input
        className="mb-6 max-w-xl"
        placeholder={t(locale, 'searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />

      {!q ? (
        <p className="text-sm text-[var(--gt-text-faint)]">{t(locale, 'searchPlaceholder')}</p>
      ) : userHits.length + channelHits.length + messageHits.length === 0 ? (
        <p className="text-sm text-[var(--gt-text-faint)]">{t(locale, 'emptySearch')}</p>
      ) : (
        <div className="space-y-6">
          {userHits.length ? (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
                {t(locale, 'profile')}
              </h2>
              {userHits.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className="mb-2 flex w-full max-w-xl items-center gap-3 rounded-xl border border-[var(--gt-border)] px-3 py-2 text-left hover:bg-white/5"
                  onClick={() => setView('friends')}
                >
                  <User className="h-4 w-4 text-[var(--gt-accent)]" />
                  {localized(locale, u.displayName, u.displayNameKa)} · @{u.username}
                </button>
              ))}
            </section>
          ) : null}
          {channelHits.length ? (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
                {t(locale, 'channels')}
              </h2>
              {channelHits.map((c) => (
                <div key={c.id} className="mb-2 flex max-w-xl items-center gap-2">
                  <Hash className="h-4 w-4 text-[var(--gt-teal)]" />
                  <span className="flex-1">{localized(locale, c.name, c.nameKa)}</span>
                  <Button size="sm" onClick={() => selectChannel(c.id)}>
                    {t(locale, 'openChannel')}
                  </Button>
                </div>
              ))}
            </section>
          ) : null}
          {messageHits.length ? (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
                {t(locale, 'results')}
              </h2>
              {messageHits.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="mb-2 flex w-full max-w-2xl items-start gap-3 rounded-xl border border-[var(--gt-border)] px-3 py-2 text-left hover:bg-white/5"
                  onClick={() => selectChannel(m.channelId)}
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 text-[var(--gt-text-faint)]" />
                  <span className="text-sm">
                    {localized(locale, m.content, m.contentKa ?? m.content)}
                  </span>
                </button>
              ))}
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}
