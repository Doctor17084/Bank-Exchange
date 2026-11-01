import { useState } from 'react'
import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function FriendsView() {
  const locale = useAppStore((s) => s.locale)
  const users = useAppStore((s) => s.users)
  const friendIds = useAppStore((s) => s.friendIds)
  const friendRequests = useAppStore((s) => s.friendRequests)
  const session = useAppStore((s) => s.session)
  const acceptFriend = useAppStore((s) => s.acceptFriend)
  const declineFriend = useAppStore((s) => s.declineFriend)
  const addFriendByUsername = useAppStore((s) => s.addFriendByUsername)
  const selectDm = useAppStore((s) => s.selectDm)
  const dmThreads = useAppStore((s) => s.dmThreads)
  const [username, setUsername] = useState('')

  const friends = users.filter((u) => friendIds.includes(u.id))
  const pending = friendRequests.filter(
    (r) => r.status === 'pending' && r.toUserId === session?.userId,
  )

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'friends')}
      </h1>
      <p className="mb-6 text-sm text-[var(--gt-text-muted)]">{t(locale, 'addFriend')}</p>

      <form
        className="mb-8 flex max-w-lg gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          addFriendByUsername(username)
          setUsername('')
        }}
      >
        <Input
          placeholder="@username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" variant="primary">
          {t(locale, 'addFriend')}
        </Button>
      </form>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
        {t(locale, 'friendRequests')}
      </h2>
      <div className="mb-8 space-y-2">
        {pending.length === 0 ? (
          <p className="text-sm text-[var(--gt-text-faint)]">—</p>
        ) : (
          pending.map((r) => {
            const from = users.find((u) => u.id === r.fromUserId)
            if (!from) return null
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.5)] px-4 py-3"
              >
                <Avatar
                  name={localized(locale, from.displayName, from.displayNameKa)}
                  hue={from.avatarHue}
                  presence={from.presence}
                />
                <div className="flex-1">
                  {localized(locale, from.displayName, from.displayNameKa)}
                </div>
                <Button size="sm" variant="primary" onClick={() => acceptFriend(r.id)}>
                  {t(locale, 'accept')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => declineFriend(r.id)}>
                  {t(locale, 'decline')}
                </Button>
              </div>
            )
          })
        )}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
        {t(locale, 'allFriends')}
      </h2>
      {friends.length === 0 ? (
        <p className="text-sm text-[var(--gt-text-faint)]">{t(locale, 'emptyFriends')}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {friends.map((f) => {
            const dm = dmThreads.find(
              (d) =>
                d.participantIds.includes(f.id) &&
                d.participantIds.includes(session?.userId ?? ''),
            )
            return (
              <div
                key={f.id}
                className="rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.5)] p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <Avatar
                    name={localized(locale, f.displayName, f.displayNameKa)}
                    hue={f.avatarHue}
                    presence={f.presence}
                  />
                  <div>
                    <div className="font-medium">
                      {localized(locale, f.displayName, f.displayNameKa)}
                    </div>
                    <div className="text-xs text-[var(--gt-text-faint)]">{t(locale, f.presence)}</div>
                  </div>
                </div>
                {dm ? (
                  <Button size="sm" variant="secondary" onClick={() => selectDm(dm.id)}>
                    {t(locale, 'openDm')}
                  </Button>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
