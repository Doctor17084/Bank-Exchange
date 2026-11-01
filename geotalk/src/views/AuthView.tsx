import { useState } from 'react'
import { t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function AuthView() {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const login = useAppStore((s) => s.login)
  const register = useAppStore((s) => s.register)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('luka@geotalk.ge')
  const [password, setPassword] = useState('••••••••')
  const [username, setUsername] = useState('luka')

  return (
    <div className="gt-atmosphere relative flex min-h-full items-center justify-center overflow-hidden p-6">
      <div className="gt-grid-noise pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 w-full max-w-md gt-animate-in">
        <div className="mb-8 text-center">
          <div
            className="gt-brand-mark mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--gt-accent)] text-2xl font-extrabold text-[#1a1408]"
            style={{ fontFamily: 'var(--gt-font-display)' }}
          >
            G
          </div>
          <h1
            className="text-4xl font-extrabold tracking-[0.06em] text-[var(--gt-text)]"
            style={{ fontFamily: 'var(--gt-font-display)' }}
          >
            {t(locale, 'brand')}
          </h1>
          <p className="mt-2 text-[var(--gt-text-muted)]">{t(locale, 'tagline')}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Badge tone="accent">{t(locale, 'phaseBadge')}</Badge>
            <Badge tone="muted">{t(locale, 'themeAtmosphere')}</Badge>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--gt-border)] bg-[rgba(12,18,24,0.82)] p-6 shadow-[var(--gt-shadow)] backdrop-blur">
          <div className="mb-4 flex gap-2">
            <Button
              className="flex-1"
              variant={mode === 'login' ? 'primary' : 'ghost'}
              onClick={() => setMode('login')}
            >
              {t(locale, 'login')}
            </Button>
            <Button
              className="flex-1"
              variant={mode === 'register' ? 'primary' : 'ghost'}
              onClick={() => setMode('register')}
            >
              {t(locale, 'register')}
            </Button>
          </div>

          {mode === 'register' ? (
            <>
              <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'username')}</label>
              <Input className="mb-3" value={username} onChange={(e) => setUsername(e.target.value)} />
            </>
          ) : null}

          <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'email')}</label>
          <Input className="mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'password')}</label>
          <Input
            className="mb-4"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            variant="accent"
            size="lg"
            onClick={() =>
              mode === 'login' ? login(email, password) : register(username, email, password)
            }
          >
            {mode === 'login' ? t(locale, 'welcomeBack') : t(locale, 'welcomeGuest')}
          </Button>

          <p className="mt-3 text-center text-xs text-[var(--gt-text-faint)]">
            {t(locale, 'stubBackend')} · {t(locale, 'extensionPoint')}
          </p>

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              variant={locale === 'ka' ? 'secondary' : 'ghost'}
              onClick={() => setLocale('ka')}
            >
              {t(locale, 'georgian')}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              variant={locale === 'en' ? 'secondary' : 'ghost'}
              onClick={() => setLocale('en')}
            >
              {t(locale, 'english')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
