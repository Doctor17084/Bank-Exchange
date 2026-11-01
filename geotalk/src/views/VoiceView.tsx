import {
  MonitorUp,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Headphones,
  VolumeX,
} from 'lucide-react'
import { localized, t } from '../i18n/messages'
import { useAppStore } from '../store/useAppStore'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { StubBanner } from '../components/ui/StubBanner'

export function VoiceView() {
  const locale = useAppStore((s) => s.locale)
  const voice = useAppStore((s) => s.voice)
  const channels = useAppStore((s) => s.channels)
  const users = useAppStore((s) => s.users)
  const session = useAppStore((s) => s.session)
  const joinVoice = useAppStore((s) => s.joinVoice)
  const leaveVoice = useAppStore((s) => s.leaveVoice)
  const toggleMute = useAppStore((s) => s.toggleMute)
  const toggleDeafen = useAppStore((s) => s.toggleDeafen)
  const toggleVideo = useAppStore((s) => s.toggleVideo)
  const toggleScreenShare = useAppStore((s) => s.toggleScreenShare)

  const channel = channels.find((c) => c.id === voice.channelId)
  const me = voice.participants.find((p) => p.userId === session?.userId)
  const voiceChannels = channels.filter((c) => c.kind === 'voice')

  return (
    <div className="gt-scroll h-full overflow-y-auto p-6">
      <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'voice')}
      </h1>
      <StubBanner hintKey="voiceHint" />

      {!voice.channelId ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {voiceChannels.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => joinVoice(c.id)}
              className="rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-5 text-left transition hover:border-[rgba(42,155,124,0.4)]"
            >
              <Headphones className="mb-3 h-5 w-5 text-[var(--gt-teal)]" />
              <div className="font-semibold">{localized(locale, c.name, c.nameKa)}</div>
              <div className="mt-2 text-sm text-[var(--gt-text-muted)]">{t(locale, 'startVoice')}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="gt-animate-in">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">
                {channel ? localized(locale, channel.name, channel.nameKa) : 'Voice'}
              </div>
              <div className="text-sm text-[var(--gt-text-muted)]">
                {t(locale, 'participants')}: {voice.participants.length}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={me?.muted ? 'danger' : 'secondary'} onClick={toggleMute}>
                {me?.muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {me?.muted ? t(locale, 'unmute') : t(locale, 'mute')}
              </Button>
              <Button size="sm" variant={me?.deafened ? 'danger' : 'secondary'} onClick={toggleDeafen}>
                {me?.deafened ? <VolumeX className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                {me?.deafened ? t(locale, 'undeafen') : t(locale, 'deafen')}
              </Button>
              <Button size="sm" variant={voice.videoOn ? 'primary' : 'secondary'} onClick={toggleVideo}>
                {voice.videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                {voice.videoOn ? t(locale, 'cameraOn') : t(locale, 'cameraOff')}
              </Button>
              <Button
                size="sm"
                variant={voice.screenSharing ? 'accent' : 'secondary'}
                onClick={toggleScreenShare}
              >
                <MonitorUp className="h-4 w-4" />
                {voice.screenSharing ? t(locale, 'sharing') : t(locale, 'notSharing')}
              </Button>
              <Button size="sm" variant="danger" onClick={leaveVoice}>
                <PhoneOff className="h-4 w-4" />
                {t(locale, 'leaveVoice')}
              </Button>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-dashed border-[rgba(224,179,90,0.3)] bg-[var(--gt-accent-soft)] px-4 py-3 text-sm text-[var(--gt-accent)]">
            {t(locale, 'videoHint')}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {voice.participants.map((p) => {
              const u = users.find((x) => x.id === p.userId)
              if (!u) return null
              return (
                <div
                  key={p.userId}
                  className={`relative overflow-hidden rounded-3xl border border-[var(--gt-border)] bg-[linear-gradient(160deg,rgba(42,155,124,0.18),rgba(18,26,34,0.9))] p-6 ${
                    p.speaking ? 'ring-1 ring-[rgba(42,155,124,0.55)]' : ''
                  }`}
                >
                  {voice.videoOn && p.userId === session?.userId ? (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(224,179,90,0.2),transparent_50%),#0c1520]" />
                  ) : null}
                  <div className="relative flex flex-col items-center gap-3">
                    <Avatar
                      name={localized(locale, u.displayName, u.displayNameKa)}
                      hue={u.avatarHue}
                      size={72}
                      presence={u.presence}
                    />
                    <div className="text-center font-medium">
                      {localized(locale, u.displayName, u.displayNameKa)}
                    </div>
                    <div className="flex gap-2 text-xs text-[var(--gt-text-muted)]">
                      {p.muted ? t(locale, 'mute') : null}
                      {p.sharingScreen ? t(locale, 'sharing') : null}
                      {p.speaking && !p.muted ? '···' : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
