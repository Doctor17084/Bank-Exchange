import { useState } from 'react'
import { t } from '../../i18n/messages'
import { useAppStore } from '../../store/useAppStore'
import type { ChannelKind } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function CreateModals() {
  const locale = useAppStore((s) => s.locale)
  const createServerOpen = useAppStore((s) => s.createServerOpen)
  const createChannelOpen = useAppStore((s) => s.createChannelOpen)
  const setCreateServerOpen = useAppStore((s) => s.setCreateServerOpen)
  const setCreateChannelOpen = useAppStore((s) => s.setCreateChannelOpen)
  const createServer = useAppStore((s) => s.createServer)
  const createChannel = useAppStore((s) => s.createChannel)

  const [serverName, setServerName] = useState('')
  const [serverNameKa, setServerNameKa] = useState('')
  const [channelName, setChannelName] = useState('')
  const [channelNameKa, setChannelNameKa] = useState('')
  const [kind, setKind] = useState<ChannelKind>('text')

  if (!createServerOpen && !createChannelOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      {createServerOpen ? (
        <div className="gt-animate-in w-full max-w-md rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-bg-1)] p-5 shadow-[var(--gt-shadow)]">
          <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: 'var(--gt-font-display)' }}>
            {t(locale, 'createServer')}
          </h3>
          <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'serverName')} (EN)</label>
          <Input className="mb-3" value={serverName} onChange={(e) => setServerName(e.target.value)} />
          <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'serverName')} (KA)</label>
          <Input className="mb-4" value={serverNameKa} onChange={(e) => setServerNameKa(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateServerOpen(false)}>
              {t(locale, 'cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                createServer(serverName, serverNameKa)
                setServerName('')
                setServerNameKa('')
              }}
            >
              {t(locale, 'create')}
            </Button>
          </div>
        </div>
      ) : null}

      {createChannelOpen ? (
        <div className="gt-animate-in w-full max-w-md rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-bg-1)] p-5 shadow-[var(--gt-shadow)]">
          <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: 'var(--gt-font-display)' }}>
            {t(locale, 'createChannel')}
          </h3>
          <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'channelName')} (EN)</label>
          <Input className="mb-3" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
          <label className="mb-1 block text-xs text-[var(--gt-text-muted)]">{t(locale, 'channelName')} (KA)</label>
          <Input className="mb-3" value={channelNameKa} onChange={(e) => setChannelNameKa(e.target.value)} />
          <div className="mb-4 flex gap-2">
            {(['text', 'voice', 'announcement'] as ChannelKind[]).map((k) => (
              <Button
                key={k}
                size="sm"
                variant={kind === k ? 'accent' : 'secondary'}
                onClick={() => setKind(k)}
              >
                {t(locale, k === 'text' ? 'textChannel' : k === 'voice' ? 'voiceChannel' : 'announcement')}
              </Button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateChannelOpen(false)}>
              {t(locale, 'cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                createChannel(channelName, channelNameKa, kind)
                setChannelName('')
                setChannelNameKa('')
                setKind('text')
              }}
            >
              {t(locale, 'create')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
