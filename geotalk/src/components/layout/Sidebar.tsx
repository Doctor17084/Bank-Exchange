import {
  Bell,
  Bot,
  FolderOpen,
  Hash,
  Headphones,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react'
import { localized, t } from '../../i18n/messages'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'
import type { AppView } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const nav: { view: AppView; icon: typeof LayoutDashboard; label: string }[] = [
  { view: 'dashboard', icon: LayoutDashboard, label: 'dashboard' },
  { view: 'dms', icon: MessageCircle, label: 'dms' },
  { view: 'friends', icon: Users, label: 'friends' },
  { view: 'voice', icon: Headphones, label: 'voice' },
  { view: 'feed', icon: Newspaper, label: 'feed' },
  { view: 'bots', icon: Bot, label: 'bots' },
  { view: 'files', icon: FolderOpen, label: 'files' },
  { view: 'search', icon: Search, label: 'search' },
  { view: 'ai', icon: Sparkles, label: 'ai' },
  { view: 'notifications', icon: Bell, label: 'notifications' },
  { view: 'admin', icon: Shield, label: 'admin' },
  { view: 'profile', icon: Settings, label: 'profile' },
]

export function Sidebar() {
  const locale = useAppStore((s) => s.locale)
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const servers = useAppStore((s) => s.servers)
  const channels = useAppStore((s) => s.channels)
  const activeServerId = useAppStore((s) => s.activeServerId)
  const activeChannelId = useAppStore((s) => s.activeChannelId)
  const selectChannel = useAppStore((s) => s.selectChannel)
  const setCreateChannelOpen = useAppStore((s) => s.setCreateChannelOpen)
  const users = useAppStore((s) => s.users)
  const session = useAppStore((s) => s.session)
  const notifications = useAppStore((s) => s.notifications)
  const mockRealtimeConnected = useAppStore((s) => s.mockRealtimeConnected)
  const setLocale = useAppStore((s) => s.setLocale)
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen)

  const me = users.find((u) => u.id === session?.userId)
  const server = servers.find((s) => s.id === activeServerId)
  const serverChannels = channels.filter((c) => c.serverId === activeServerId)
  const unreadNotifs = notifications.filter((n) => !n.read).length

  return (
    <aside
      className={cn(
        'gt-glass flex w-[280px] shrink-0 flex-col border-r border-[var(--gt-border)] max-lg:absolute max-lg:inset-y-0 max-lg:left-[72px] max-lg:z-30 max-lg:shadow-2xl',
        mobileNavOpen ? 'max-lg:flex' : 'max-lg:hidden',
      )}
    >
      <div className="border-b border-[var(--gt-border)] px-4 py-4">
        <div
          className="text-xl font-bold tracking-[0.04em] text-[var(--gt-text)]"
          style={{ fontFamily: 'var(--gt-font-display)' }}
        >
          {t(locale, 'brand')}
        </div>
        <div className="mt-1 text-xs text-[var(--gt-text-muted)]">{t(locale, 'tagline')}</div>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="accent">{t(locale, 'phaseBadge')}</Badge>
          <Badge tone={mockRealtimeConnected ? 'teal' : 'muted'}>
            {mockRealtimeConnected ? t(locale, 'connected') : t(locale, 'connecting')}
          </Badge>
        </div>
      </div>

      <div className="gt-scroll flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-4 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon
            const active = view === item.view
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => setView(item.view)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-[var(--gt-teal-soft)] text-[var(--gt-text)]'
                    : 'text-[var(--gt-text-muted)] hover:bg-white/5 hover:text-[var(--gt-text)]',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{t(locale, item.label)}</span>
                {item.view === 'notifications' && unreadNotifs > 0 ? (
                  <span className="rounded-md bg-[var(--gt-accent)] px-1.5 text-[11px] font-semibold text-[#1a1408]">
                    {unreadNotifs}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {server ? (
          <div className="gt-animate-in rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">
                  {localized(locale, server.name, server.nameKa)}
                </div>
                <div className="text-xs text-[var(--gt-text-faint)]">{t(locale, 'channels')}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCreateChannelOpen(true)}
                className="!px-2"
              >
                +
              </Button>
            </div>
            <div className="space-y-0.5">
              {serverChannels.map((ch) => {
                const active = activeChannelId === ch.id && (view === 'server' || view === 'voice')
                const Icon = ch.kind === 'voice' ? Volume2 : Hash
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => selectChannel(ch.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition',
                      active
                        ? 'bg-white/10 text-[var(--gt-text)]'
                        : 'text-[var(--gt-text-muted)] hover:bg-white/5 hover:text-[var(--gt-text)]',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-70" />
                    <span className="flex-1 truncate text-left">
                      {localized(locale, ch.name, ch.nameKa)}
                    </span>
                    {ch.unread ? (
                      <span className="rounded bg-[var(--gt-accent)] px-1.5 text-[10px] font-bold text-[#1a1408]">
                        {ch.unread}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[var(--gt-border)] p-3">
        <div className="mb-2 flex gap-1">
          <Button
            size="sm"
            variant={locale === 'ka' ? 'accent' : 'ghost'}
            className="flex-1"
            onClick={() => setLocale('ka')}
          >
            {t(locale, 'georgian')}
          </Button>
          <Button
            size="sm"
            variant={locale === 'en' ? 'accent' : 'ghost'}
            className="flex-1"
            onClick={() => setLocale('en')}
          >
            {t(locale, 'english')}
          </Button>
        </div>
        {me ? (
          <button
            type="button"
            onClick={() => setView('profile')}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
          >
            <Avatar name={localized(locale, me.displayName, me.displayNameKa)} hue={me.avatarHue} presence={me.presence} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {localized(locale, me.displayName, me.displayNameKa)}
              </div>
              <div className="truncate text-xs text-[var(--gt-text-faint)]">
                {localized(locale, me.status, me.statusKa)}
              </div>
            </div>
          </button>
        ) : null}
      </div>
    </aside>
  )
}
