import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { StubBanner } from '../components/ui/StubBanner'

export function AiView() {
  const locale = useAppStore((s) => s.locale)
  const aiThread = useAppStore((s) => s.aiThread)
  const askAi = useAppStore((s) => s.askAi)
  const [prompt, setPrompt] = useState('')

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col p-6">
      <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'ai')}
      </h1>
      <StubBanner hintKey="extensionPoint" />
      <p className="mb-4 text-sm text-[var(--gt-text-muted)]">{t(locale, 'aiGreeting')}</p>

      <div className="gt-scroll mb-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.45)] p-4">
        {aiThread.length === 0 ? (
          <div className="grid h-full min-h-[200px] place-items-center text-sm text-[var(--gt-text-faint)]">
            <div className="text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-[var(--gt-accent)]" />
              {t(locale, 'aiPlaceholder')}
            </div>
          </div>
        ) : (
          aiThread.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'user'
                  ? 'ml-auto bg-[var(--gt-teal-soft)] text-[var(--gt-text)]'
                  : 'bg-[var(--gt-bg-3)] text-[var(--gt-text-muted)]'
              }`}
            >
              {m.text}
            </div>
          ))
        )}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          askAi(prompt)
          setPrompt('')
        }}
      >
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t(locale, 'aiPlaceholder')}
        />
        <Button type="submit" variant="accent">
          {t(locale, 'sendMessage')}
        </Button>
      </form>
    </div>
  )
}
