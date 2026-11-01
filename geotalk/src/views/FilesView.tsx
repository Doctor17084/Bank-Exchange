import { FileText } from 'lucide-react'
import { localized, t } from '../i18n/messages'
import { formatDay } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../components/ui/Button'
import { StubBanner } from '../components/ui/StubBanner'

export function FilesView() {
  const locale = useAppStore((s) => s.locale)
  const files = useAppStore((s) => s.files)
  const users = useAppStore((s) => s.users)
  const channels = useAppStore((s) => s.channels)
  const addFile = useAppStore((s) => s.addFile)

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
          {t(locale, 'files')}
        </h1>
        <Button
          variant="primary"
          onClick={() => addFile(`upload-${Date.now()}.png`)}
        >
          {t(locale, 'shareFile')}
        </Button>
      </div>
      <StubBanner hintKey="filesHint" />
      {files.length === 0 ? (
        <p className="text-sm text-[var(--gt-text-faint)]">{t(locale, 'emptyFiles')}</p>
      ) : (
        <div className="space-y-2">
          {files.map((f) => {
            const by = users.find((u) => u.id === f.sharedBy)
            const ch = channels.find((c) => c.id === f.channelId)
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.5)] px-4 py-3"
              >
                <FileText className="h-5 w-5 text-[var(--gt-accent)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{f.name}</div>
                  <div className="text-xs text-[var(--gt-text-faint)]">
                    {f.sizeLabel}
                    {by
                      ? ` · ${localized(locale, by.displayName, by.displayNameKa)}`
                      : ''}
                    {ch ? ` · #${localized(locale, ch.name, ch.nameKa)}` : ''}
                    {` · ${formatDay(f.createdAt, locale)}`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
