import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { StubBanner } from '../components/ui/StubBanner'
import { Avatar } from '../components/ui/Avatar'

const matrix = [
  { role: 'owner', manageRoles: true, kick: true, ban: true, announce: true },
  { role: 'admin', manageRoles: true, kick: true, ban: true, announce: true },
  { role: 'moderator', manageRoles: false, kick: true, ban: false, announce: false },
  { role: 'member', manageRoles: false, kick: false, ban: false, announce: false },
  { role: 'guest', manageRoles: false, kick: false, ban: false, announce: false },
]

export function AdminView() {
  const locale = useAppStore((s) => s.locale)
  const servers = useAppStore((s) => s.servers)
  const users = useAppStore((s) => s.users)
  const activeServerId = useAppStore((s) => s.activeServerId)
  const showToast = useAppStore((s) => s.showToast)
  const server = servers.find((s) => s.id === activeServerId) ?? servers[0]
  const members = users.filter((u) => server?.memberIds.includes(u.id))

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'admin')}
      </h1>
      <StubBanner hintKey="adminHint" />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
        {t(locale, 'roles')}
      </h2>
      <p className="mb-4 text-sm text-[var(--gt-text-muted)]">{t(locale, 'rolesHint')}</p>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-[var(--gt-border)]">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[var(--gt-bg-2)] text-[var(--gt-text-faint)]">
            <tr>
              <th className="px-4 py-3 font-medium">{t(locale, 'roles')}</th>
              <th className="px-4 py-3 font-medium">{t(locale, 'manageRoles')}</th>
              <th className="px-4 py-3 font-medium">{t(locale, 'kick')}</th>
              <th className="px-4 py-3 font-medium">{t(locale, 'ban')}</th>
              <th className="px-4 py-3 font-medium">{t(locale, 'announcement')}</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.role} className="border-t border-[var(--gt-border)]">
                <td className="px-4 py-3 font-medium">{t(locale, row.role === 'admin' ? 'admin' : row.role)}</td>
                {(['manageRoles', 'kick', 'ban', 'announce'] as const).map((key) => (
                  <td key={key} className="px-4 py-3">
                    <Badge tone={row[key] ? 'teal' : 'muted'}>{row[key] ? '✓' : '—'}</Badge>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gt-text-faint)]">
        {server ? localized(locale, server.name, server.nameKa) : ''} · {t(locale, 'members')}
      </h2>
      <div className="space-y-2">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.45)] px-4 py-3"
          >
            <Avatar
              name={localized(locale, m.displayName, m.displayNameKa)}
              hue={m.avatarHue}
              presence={m.presence}
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium">{localized(locale, m.displayName, m.displayNameKa)}</div>
              <div className="text-xs text-[var(--gt-text-faint)]">
                {m.roles.map((r) => t(locale, r === 'admin' ? 'admin' : r)).join(' · ')}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => showToast(`${t(locale, 'kick')} (stub)`)}
            >
              {t(locale, 'kick')}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => showToast(`${t(locale, 'ban')} (stub)`)}
            >
              {t(locale, 'ban')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
