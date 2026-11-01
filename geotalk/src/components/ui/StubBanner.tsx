import { Sparkles } from 'lucide-react'
import { t } from '../../i18n/messages'
import { useAppStore } from '../../store/useAppStore'

export function StubBanner({ hintKey }: { hintKey: string }) {
  const locale = useAppStore((s) => s.locale)
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-dashed border-[rgba(224,179,90,0.35)] bg-[var(--gt-accent-soft)] px-3 py-2.5 text-sm text-[var(--gt-accent)]">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <div className="font-medium">{t(locale, 'stubBackend')}</div>
        <div className="text-[var(--gt-text-muted)]">{t(locale, hintKey)}</div>
        <div className="mt-1 text-xs opacity-80">{t(locale, 'extensionPoint')}</div>
      </div>
    </div>
  )
}
