import { useState } from 'react'
import { Heart, MessageSquare } from 'lucide-react'
import { localized, t } from '../i18n/messages'
import { formatDay } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { TextArea } from '../components/ui/Input'

export function FeedView() {
  const locale = useAppStore((s) => s.locale)
  const feedPosts = useAppStore((s) => s.feedPosts)
  const users = useAppStore((s) => s.users)
  const publishFeedPost = useAppStore((s) => s.publishFeedPost)
  const toggleFeedLike = useAppStore((s) => s.toggleFeedLike)
  const [draft, setDraft] = useState('')

  return (
    <div className="gt-scroll mx-auto h-full max-w-2xl overflow-y-auto p-6">
      <h1 className="mb-4 text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>
        {t(locale, 'feed')}
      </h1>
      <div className="mb-6 rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.55)] p-4">
        <TextArea
          placeholder={t(locale, 'postPlaceholder')}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <Button
            variant="primary"
            onClick={() => {
              publishFeedPost(draft, draft)
              setDraft('')
            }}
          >
            {t(locale, 'publish')}
          </Button>
        </div>
      </div>

      {feedPosts.length === 0 ? (
        <p className="text-sm text-[var(--gt-text-faint)]">{t(locale, 'emptyFeed')}</p>
      ) : (
        <div className="space-y-4">
          {feedPosts.map((p) => {
            const author = users.find((u) => u.id === p.authorId)
            return (
              <article
                key={p.id}
                className="gt-animate-in rounded-2xl border border-[var(--gt-border)] bg-[rgba(18,26,34,0.5)] p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  {author ? (
                    <Avatar
                      name={localized(locale, author.displayName, author.displayNameKa)}
                      hue={author.avatarHue}
                      presence={author.presence}
                    />
                  ) : null}
                  <div>
                    <div className="text-sm font-semibold">
                      {author
                        ? localized(locale, author.displayName, author.displayNameKa)
                        : '—'}
                    </div>
                    <div className="text-xs text-[var(--gt-text-faint)]">
                      {formatDay(p.createdAt, locale)}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">
                  {localized(locale, p.content, p.contentKa)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant={p.likedByMe ? 'accent' : 'ghost'} onClick={() => toggleFeedLike(p.id)}>
                    <Heart className="h-3.5 w-3.5" />
                    {p.likes}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {p.comments}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
