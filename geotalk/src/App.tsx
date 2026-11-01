import { useEffect } from 'react'
import { CreateModals } from './components/modals/CreateModals'
import { ServerRail } from './components/layout/ServerRail'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { useAppStore } from './store/useAppStore'
import { AuthView } from './views/AuthView'
import { DashboardView } from './views/DashboardView'
import { ServerView } from './views/ServerView'
import { DmsView } from './views/DmsView'
import { FriendsView } from './views/FriendsView'
import { VoiceView } from './views/VoiceView'
import { FeedView } from './views/FeedView'
import { BotsView } from './views/BotsView'
import { SearchView } from './views/SearchView'
import { AiView } from './views/AiView'
import { NotificationsView } from './views/NotificationsView'
import { ProfileView } from './views/ProfileView'
import { AdminView } from './views/AdminView'
import { FilesView } from './views/FilesView'

function MainSurface() {
  const view = useAppStore((s) => s.view)
  switch (view) {
    case 'dashboard':
      return <DashboardView />
    case 'server':
      return <ServerView />
    case 'dms':
      return <DmsView />
    case 'friends':
      return <FriendsView />
    case 'voice':
      return <VoiceView />
    case 'feed':
      return <FeedView />
    case 'bots':
      return <BotsView />
    case 'search':
      return <SearchView />
    case 'ai':
      return <AiView />
    case 'notifications':
      return <NotificationsView />
    case 'profile':
    case 'settings':
      return <ProfileView />
    case 'admin':
      return <AdminView />
    case 'files':
      return <FilesView />
    default:
      return <DashboardView />
  }
}

export default function App() {
  const session = useAppStore((s) => s.session)
  const toast = useAppStore((s) => s.toast)
  const clearToast = useAppStore((s) => s.clearToast)
  const bootstrapMockRealtime = useAppStore((s) => s.bootstrapMockRealtime)
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)

  useEffect(() => {
    if (!session) return
    return bootstrapMockRealtime()
  }, [session, bootstrapMockRealtime])

  if (!session) return <AuthView />

  return (
    <div className="gt-atmosphere flex h-full min-h-0 overflow-hidden">
      <div className="gt-grid-noise pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 flex h-full min-h-0 w-full">
        <ServerRail />
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main
            className="relative min-h-0 flex-1 bg-[rgba(7,10,15,0.35)]"
            onClick={() => setMobileNavOpen(false)}
          >
            <MainSurface />
          </main>
        </div>
      </div>
      <CreateModals />
      {toast ? (
        <div className="gt-animate-in fixed bottom-6 right-6 z-50 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-bg-2)] px-4 py-3 text-sm shadow-[var(--gt-shadow)]">
          <button type="button" className="text-left" onClick={clearToast}>
            {toast}
          </button>
        </div>
      ) : null}
    </div>
  )
}
