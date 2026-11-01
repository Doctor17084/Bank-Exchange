import { t, localized } from '../i18n/messages'
import { formatTime } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function NotificationsView() {
  const locale = useAppStore((s) => s.locale)
  const notifications = useAppStore((s) => s.notifications)
  const markNotificationRead = useAppStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead)

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
          {t(locale, 'notifications')}
        </h1>
        <Button size="sm" variant="secondary" onClick={markAllNotificationsRead}>
          {t(locale, 'markAllRead')}
        </Button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-sm text-[var(--gt-text-faint)]">{t(locale, 'noNotifications')}</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markNotificationRead(n.id)}
              className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                n.read
                  ? 'border-[var(--gt-border)] bg-transparent opacity-70'
                  : 'border-[rgba(224,179,90,0.35)] bg-[var(--gt-accent-soft)]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{localized(locale, n.title, n.titleKa)}</span>
                  {!n.read ? <Badge tone="accent">{t(locale, 'unread')}</Badge> : null}
                </div>
                <p className="text-sm text-[var(--gt-text-muted)]">
                  {localized(locale, n.body, n.bodyKa)}
                </p>
              </div>
              <span className="shrink-0 text-xs text-[var(--gt-text-faint)]">
                {formatTime(n.createdAt, locale)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
