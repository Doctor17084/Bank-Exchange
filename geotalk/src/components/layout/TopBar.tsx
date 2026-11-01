import { Menu, Search } from 'lucide-react'
import { t } from '../../i18n/messages'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/Button'

export function TopBar() {
  const locale = useAppStore((s) => s.locale)
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen)
  const setView = useAppStore((s) => s.setView)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--gt-border)] px-3 lg:hidden">
      <Button
        size="sm"
        variant="ghost"
        className="!px-2"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div
        className="flex-1 text-sm font-bold tracking-[0.08em]"
        style={{ fontFamily: 'var(--gt-font-display)' }}
      >
        {t(locale, 'brand')}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="!px-2"
        onClick={() => {
          setSearchQuery('')
          setView('search')
        }}
      >
        <Search className="h-4 w-4" />
      </Button>
    </header>
  )
}
