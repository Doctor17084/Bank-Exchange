import { Paperclip, Send, Smile } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { localized, t } from '../../i18n/messages'
import { cn, formatTime } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

interface Props {
  channelId: string
  title: string
  subtitle?: string
}

export function ChatPanel({ channelId, title, subtitle }: Props) {
  const locale = useAppStore((s) => s.locale)
  const messages = useAppStore((s) => s.messages)
  const users = useAppStore((s) => s.users)
  const session = useAppStore((s) => s.session)
  const composerDraft = useAppStore((s) => s.composerDraft)
  const setComposerDraft = useAppStore((s) => s.setComposerDraft)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const toggleReaction = useAppStore((s) => s.toggleReaction)
  const deleteMessage = useAppStore((s) => s.deleteMessage)
  const addFile = useAppStore((s) => s.addFile)
  const endRef = useRef<HTMLDivElement>(null)

  const thread = messages
    .filter((m) => m.channelId === channelId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length, channelId])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between border-b border-[var(--gt-border)] px-5 py-3">
        <div className="gt-animate-in">
          <h2
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: 'var(--gt-font-display)' }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-[var(--gt-text-muted)]">{subtitle}</p>
          ) : null}
        </div>
      </header>

      <div className="gt-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {thread.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-[var(--gt-text-faint)]">
            {t(locale, 'noMessages')}
          </div>
        ) : (
          thread.map((msg, i) => {
            const author = users.find((u) => u.id === msg.authorId)
            const mine = msg.authorId === session?.userId
            const text = localized(locale, msg.content, msg.contentKa ?? msg.content)
            return (
              <article
                key={msg.id}
                className={cn(
                  'gt-animate-in group flex gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/[0.03]',
                  i === thread.length - 1 && 'gt-animate-delay-1',
                )}
              >
                {author ? (
                  <Avatar
                    name={localized(locale, author.displayName, author.displayNameKa)}
                    hue={author.avatarHue}
                    presence={author.presence}
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold">
                      {author
                        ? localized(locale, author.displayName, author.displayNameKa)
                        : 'Unknown'}
                      {mine ? (
                        <span className="ml-1 text-xs font-normal text-[var(--gt-text-faint)]">
                          ({t(locale, 'you')})
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs text-[var(--gt-text-faint)]">
                      {formatTime(msg.createdAt, locale)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--gt-text)]">
                    {text}
                  </p>
                  {msg.attachments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((a) => (
                        <div
                          key={a.id}
                          className="rounded-lg border border-[var(--gt-border)] bg-[var(--gt-bg-2)] px-3 py-2 text-xs text-[var(--gt-text-muted)]"
                        >
                          {a.name} · {a.sizeLabel}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {(msg.reactions ?? []).map((r) => (
                      <button
                        key={r.emoji}
                        type="button"
                        onClick={() => toggleReaction(msg.id, r.emoji)}
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-xs transition',
                          r.me
                            ? 'border-[rgba(42,155,124,0.5)] bg-[var(--gt-teal-soft)]'
                            : 'border-[var(--gt-border)] bg-white/5 hover:bg-white/10',
                        )}
                      >
                        {r.emoji} {r.count}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rounded-full border border-transparent px-2 py-0.5 text-xs text-[var(--gt-text-faint)] opacity-0 transition group-hover:opacity-100 hover:border-[var(--gt-border)] hover:bg-white/5"
                      onClick={() => toggleReaction(msg.id, '👍')}
                      title={t(locale, 'react')}
                    >
                      <Smile className="inline h-3.5 w-3.5" />
                    </button>
                    {mine ? (
                      <button
                        type="button"
                        className="rounded-full px-2 py-0.5 text-xs text-[var(--gt-danger)] opacity-0 transition group-hover:opacity-100"
                        onClick={() => deleteMessage(msg.id)}
                      >
                        {t(locale, 'delete')}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })
        )}
        <div ref={endRef} />
      </div>

      <form
        className="border-t border-[var(--gt-border)] p-4"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(channelId, composerDraft)
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-bg-2)] p-2 focus-within:border-[rgba(42,155,124,0.45)]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="!px-2"
            onClick={() => addFile(`share-${Date.now()}.txt`)}
            title={t(locale, 'attachFile')}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <textarea
            value={composerDraft}
            onChange={(e) => setComposerDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(channelId, composerDraft)
              }
            }}
            rows={1}
            placeholder={t(locale, 'typeMessage')}
            className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-[var(--gt-text-faint)]"
          />
          <Button type="submit" variant="primary" size="sm" disabled={!composerDraft.trim()}>
            <Send className="h-4 w-4" />
            {t(locale, 'sendMessage')}
          </Button>
        </div>
      </form>
    </div>
  )
}
