import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import type { Presence } from '../types'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'

export function ProfileView() {
  const locale = useAppStore((s) => s.locale)
  const users = useAppStore((s) => s.users)
  const session = useAppStore((s) => s.session)
  const profileDraft = useAppStore((s) => s.profileDraft)
  const startProfileEdit = useAppStore((s) => s.startProfileEdit)
  const updateProfileDraft = useAppStore((s) => s.updateProfileDraft)
  const saveProfile = useAppStore((s) => s.saveProfile)
  const cancelProfileEdit = useAppStore((s) => s.cancelProfileEdit)
  const setPresence = useAppStore((s) => s.setPresence)
  const logout = useAppStore((s) => s.logout)

  const me = users.find((u) => u.id === session?.userId)
  if (!me) return null

  const editing = !!profileDraft

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-xl">
        <div className="gt-animate-in mb-6 overflow-hidden rounded-[28px] border border-[var(--gt-border)]">
          <div className="h-28 bg-[radial-gradient(600px_180px_at_20%_0%,rgba(224,179,90,0.35),transparent),linear-gradient(120deg,#12201c,#0c1520)]" />
          <div className="-mt-10 px-6 pb-6">
            <Avatar
              name={localized(locale, me.displayName, me.displayNameKa)}
              hue={me.avatarHue}
              presence={me.presence}
              size={80}
              className="ring-4 ring-[var(--gt-bg-1)]"
            />
            <h1 className="mt-3 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
              {localized(locale, me.displayName, me.displayNameKa)}
            </h1>
            <p className="text-sm text-[var(--gt-text-muted)]">@{me.username}</p>
            <p className="mt-2 text-sm">{localized(locale, me.bio, me.bioKa)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {me.roles.map((r) => (
                <Badge key={r} tone="teal">
                  {t(locale, r === 'admin' ? 'admin' : r)}
                </Badge>
              ))}
              <Badge tone="muted">
                {t(locale, 'joined')} {me.joinedAt}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['online', 'idle', 'dnd', 'offline'] as Presence[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={me.presence === p ? 'accent' : 'secondary'}
              onClick={() => setPresence(p)}
            >
              {t(locale, p)}
            </Button>
          ))}
        </div>

        {!editing ? (
          <div className="flex gap-2">
            <Button variant="primary" onClick={startProfileEdit}>
              {t(locale, 'editProfile')}
            </Button>
            <Button variant="danger" onClick={logout}>
              {t(locale, 'logout')}
            </Button>
          </div>
        ) : (
          <div className="gt-animate-in space-y-3 rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-4">
            <label className="block text-xs text-[var(--gt-text-muted)]">{t(locale, 'displayName')} (EN)</label>
            <Input
              value={profileDraft.displayName ?? ''}
              onChange={(e) => updateProfileDraft({ displayName: e.target.value })}
            />
            <label className="block text-xs text-[var(--gt-text-muted)]">{t(locale, 'displayName')} (KA)</label>
            <Input
              value={profileDraft.displayNameKa ?? ''}
              onChange={(e) => updateProfileDraft({ displayNameKa: e.target.value })}
            />
            <label className="block text-xs text-[var(--gt-text-muted)]">{t(locale, 'status')} (EN)</label>
            <Input
              value={profileDraft.status ?? ''}
              onChange={(e) => updateProfileDraft({ status: e.target.value })}
            />
            <label className="block text-xs text-[var(--gt-text-muted)]">{t(locale, 'status')} (KA)</label>
            <Input
              value={profileDraft.statusKa ?? ''}
              onChange={(e) => updateProfileDraft({ statusKa: e.target.value })}
            />
            <label className="block text-xs text-[var(--gt-text-muted)]">{t(locale, 'bio')} (EN)</label>
            <TextArea
              value={profileDraft.bio ?? ''}
              onChange={(e) => updateProfileDraft({ bio: e.target.value })}
            />
            <label className="block text-xs text-[var(--gt-text-muted)]">{t(locale, 'bio')} (KA)</label>
            <TextArea
              value={profileDraft.bioKa ?? ''}
              onChange={(e) => updateProfileDraft({ bioKa: e.target.value })}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="primary" onClick={saveProfile}>
                {t(locale, 'save')}
              </Button>
              <Button variant="ghost" onClick={cancelProfileEdit}>
                {t(locale, 'cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
