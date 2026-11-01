import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { StubBanner } from '../components/ui/StubBanner'

export function BotsView() {
  const locale = useAppStore((s) => s.locale)
  const bots = useAppStore((s) => s.bots)
  const toggleBotInstall = useAppStore((s) => s.toggleBotInstall)

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'bots')}
      </h1>
      <StubBanner hintKey="extensionPoint" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bots.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-5"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{localized(locale, b.name, b.nameKa)}</div>
                <Badge tone="muted" className="mt-1">
                  {localized(locale, b.category, b.categoryKa)}
                </Badge>
              </div>
              <div className="text-xs text-[var(--gt-text-faint)]">{b.installs}</div>
            </div>
            <p className="mb-4 text-sm text-[var(--gt-text-muted)]">
              {localized(locale, b.description, b.descriptionKa)}
            </p>
            <Button
              size="sm"
              variant={b.installed ? 'secondary' : 'primary'}
              onClick={() => toggleBotInstall(b.id)}
            >
              {b.installed ? t(locale, 'uninstall') : t(locale, 'install')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
