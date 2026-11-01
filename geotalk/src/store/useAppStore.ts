import { create } from 'zustand'
import {
  bots as seedBots,
  channels as seedChannels,
  CURRENT_USER_ID,
  dmThreads as seedDms,
  feedPosts as seedFeed,
  friendIds as seedFriendIds,
  friendRequests as seedFriendRequests,
  messages as seedMessages,
  notifications as seedNotifications,
  servers as seedServers,
  sharedFiles as seedFiles,
  users as seedUsers,
} from '../data/seed'
import { loadJson, saveJson } from '../lib/persistence'
import type {
  AppView,
  AuthSession,
  BotListing,
  Channel,
  ChannelKind,
  ChatMessage,
  DirectThread,
  FeedPost,
  FriendRequest,
  Locale,
  NotificationItem,
  Presence,
  Server,
  User,
  VoiceRoomState,
} from '../types'

interface PersistedSlice {
  locale: Locale
  session: AuthSession | null
  messages: ChatMessage[]
  servers: Server[]
  channels: Channel[]
  notifications: NotificationItem[]
  friendIds: string[]
  friendRequests: FriendRequest[]
  bots: BotListing[]
  feedPosts: FeedPost[]
  files: typeof seedFiles
  activeServerId: string | null
  activeChannelId: string | null
  activeDmId: string | null
  view: AppView
}

function defaultPersisted(): PersistedSlice {
  return {
    locale: 'ka',
    session: {
      userId: CURRENT_USER_ID,
      token: 'mock-token-phase1',
      mock: true,
    },
    messages: seedMessages,
    servers: seedServers,
    channels: seedChannels,
    notifications: seedNotifications,
    friendIds: seedFriendIds,
    friendRequests: seedFriendRequests,
    bots: seedBots,
    feedPosts: seedFeed,
    files: seedFiles,
    activeServerId: 's-geotalk',
    activeChannelId: 'c-general',
    activeDmId: null,
    view: 'dashboard',
  }
}

const persisted = loadJson<PersistedSlice>('state', defaultPersisted())

interface AppState extends PersistedSlice {
  users: User[]
  dmThreads: DirectThread[]
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  composerDraft: string
  searchQuery: string
  profileDraft: Partial<User> | null
  voice: VoiceRoomState
  aiThread: { role: 'user' | 'assistant'; text: string }[]
  toast: string | null
  mockRealtimeConnected: boolean
  createServerOpen: boolean
  createChannelOpen: boolean
  authMode: 'login' | 'register'

  setLocale: (locale: Locale) => void
  setView: (view: AppView) => void
  selectServer: (serverId: string) => void
  selectChannel: (channelId: string) => void
  selectDm: (dmId: string) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
  setComposerDraft: (value: string) => void
  sendMessage: (channelId: string, content: string) => void
  toggleReaction: (messageId: string, emoji: string) => void
  deleteMessage: (messageId: string) => void
  setSearchQuery: (q: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  acceptFriend: (requestId: string) => void
  declineFriend: (requestId: string) => void
  addFriendByUsername: (username: string) => void
  setPresence: (presence: Presence) => void
  startProfileEdit: () => void
  updateProfileDraft: (patch: Partial<User>) => void
  saveProfile: () => void
  cancelProfileEdit: () => void
  createServer: (name: string, nameKa: string) => void
  createChannel: (name: string, nameKa: string, kind: ChannelKind) => void
  setCreateServerOpen: (open: boolean) => void
  setCreateChannelOpen: (open: boolean) => void
  joinVoice: (channelId: string) => void
  leaveVoice: () => void
  toggleMute: () => void
  toggleDeafen: () => void
  toggleVideo: () => void
  toggleScreenShare: () => void
  toggleBotInstall: (botId: string) => void
  publishFeedPost: (content: string, contentKa: string) => void
  toggleFeedLike: (postId: string) => void
  addFile: (name: string) => void
  askAi: (prompt: string) => void
  login: (email: string, _password: string) => void
  logout: () => void
  register: (username: string, email: string, _password: string) => void
  showToast: (msg: string) => void
  clearToast: () => void
  persist: () => void
  bootstrapMockRealtime: () => () => void
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export const useAppStore = create<AppState>((set, get) => ({
  ...persisted,
  users: seedUsers,
  dmThreads: seedDms,
  sidebarCollapsed: false,
  mobileNavOpen: false,
  composerDraft: '',
  searchQuery: '',
  profileDraft: null,
  voice: {
    channelId: null,
    participants: [],
    videoOn: false,
    screenSharing: false,
  },
  aiThread: [],
  toast: null,
  mockRealtimeConnected: false,
  createServerOpen: false,
  createChannelOpen: false,
  authMode: 'login',

  persist: () => {
    const s = get()
    saveJson<PersistedSlice>('state', {
      locale: s.locale,
      session: s.session,
      messages: s.messages,
      servers: s.servers,
      channels: s.channels,
      notifications: s.notifications,
      friendIds: s.friendIds,
      friendRequests: s.friendRequests,
      bots: s.bots,
      feedPosts: s.feedPosts,
      files: s.files,
      activeServerId: s.activeServerId,
      activeChannelId: s.activeChannelId,
      activeDmId: s.activeDmId,
      view: s.view,
    })
  },

  setLocale: (locale) => {
    set({ locale })
    get().persist()
  },

  setView: (view) => {
    set({ view, mobileNavOpen: false })
    get().persist()
  },

  selectServer: (serverId) => {
    const channels = get().channels.filter((c) => c.serverId === serverId)
    const firstText = channels.find((c) => c.kind !== 'voice') ?? channels[0]
    set({
      activeServerId: serverId,
      activeChannelId: firstText?.id ?? null,
      activeDmId: null,
      view: 'server',
      mobileNavOpen: false,
    })
    get().persist()
  },

  selectChannel: (channelId) => {
    const channel = get().channels.find((c) => c.id === channelId)
    if (!channel) return
    if (channel.kind === 'voice') {
      get().joinVoice(channelId)
      set({
        activeServerId: channel.serverId,
        activeChannelId: channelId,
        view: 'voice',
        mobileNavOpen: false,
      })
    } else {
      set({
        activeServerId: channel.serverId,
        activeChannelId: channelId,
        activeDmId: null,
        view: 'server',
        channels: get().channels.map((c) =>
          c.id === channelId ? { ...c, unread: 0 } : c,
        ),
        mobileNavOpen: false,
      })
    }
    get().persist()
  },

  selectDm: (dmId) => {
    set({
      activeDmId: dmId,
      activeChannelId: dmId,
      view: 'dms',
      dmThreads: get().dmThreads.map((d) =>
        d.id === dmId ? { ...d, unread: 0 } : d,
      ),
      mobileNavOpen: false,
    })
    get().persist()
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setComposerDraft: (value) => set({ composerDraft: value }),

  sendMessage: (channelId, content) => {
    const trimmed = content.trim()
    if (!trimmed) return
    const session = get().session
    if (!session) return
    const msg: ChatMessage = {
      id: uid('m'),
      channelId,
      authorId: session.userId,
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      messages: [...s.messages, msg],
      composerDraft: '',
      dmThreads: s.dmThreads.map((d) =>
        d.id === channelId
          ? { ...d, lastMessageAt: msg.createdAt, unread: 0 }
          : d,
      ),
    }))
    get().persist()
  },

  toggleReaction: (messageId, emoji) => {
    set((s) => ({
      messages: s.messages.map((m) => {
        if (m.id !== messageId) return m
        const reactions = [...(m.reactions ?? [])]
        const idx = reactions.findIndex((r) => r.emoji === emoji)
        if (idx === -1) {
          reactions.push({ emoji, count: 1, me: true })
        } else {
          const r = reactions[idx]
          if (r.me) {
            const next = { ...r, count: r.count - 1, me: false }
            if (next.count <= 0) reactions.splice(idx, 1)
            else reactions[idx] = next
          } else {
            reactions[idx] = { ...r, count: r.count + 1, me: true }
          }
        }
        return { ...m, reactions }
      }),
    }))
    get().persist()
  },

  deleteMessage: (messageId) => {
    set((s) => ({
      messages: s.messages.filter((m) => m.id !== messageId),
    }))
    get().persist()
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }))
    get().persist()
  },

  markAllNotificationsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }))
    get().persist()
  },

  acceptFriend: (requestId) => {
    const req = get().friendRequests.find((r) => r.id === requestId)
    if (!req) return
    set((s) => ({
      friendRequests: s.friendRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'accepted' } : r,
      ),
      friendIds: s.friendIds.includes(req.fromUserId)
        ? s.friendIds
        : [...s.friendIds, req.fromUserId],
    }))
    get().showToast('Friend added')
    get().persist()
  },

  declineFriend: (requestId) => {
    set((s) => ({
      friendRequests: s.friendRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'declined' } : r,
      ),
    }))
    get().persist()
  },

  addFriendByUsername: (username) => {
    const user = get().users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
    )
    if (!user) {
      get().showToast('User not found')
      return
    }
    if (get().friendIds.includes(user.id)) {
      get().showToast('Already friends')
      return
    }
    set((s) => ({ friendIds: [...s.friendIds, user.id] }))
    get().showToast('Friend added')
    get().persist()
  },

  setPresence: (presence) => {
    const id = get().session?.userId
    if (!id) return
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, presence } : u)),
    }))
  },

  startProfileEdit: () => {
    const me = get().users.find((u) => u.id === get().session?.userId)
    set({ profileDraft: me ? { ...me } : null })
  },

  updateProfileDraft: (patch) => {
    set((s) => ({
      profileDraft: s.profileDraft ? { ...s.profileDraft, ...patch } : patch,
    }))
  },

  saveProfile: () => {
    const draft = get().profileDraft
    const id = get().session?.userId
    if (!draft || !id) return
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, ...draft, id } : u)),
      profileDraft: null,
    }))
    get().showToast('Profile saved')
    get().persist()
  },

  cancelProfileEdit: () => set({ profileDraft: null }),

  createServer: (name, nameKa) => {
    const id = uid('s')
    const channelId = uid('c')
    const me = get().session?.userId ?? CURRENT_USER_ID
    const server: Server = {
      id,
      name: name || 'New community',
      nameKa: nameKa || name || 'ახალი თემა',
      description: 'Fresh community',
      descriptionKa: 'ახალი თემა',
      accent: '#2A9B7C',
      iconLetter: (name || 'G').slice(0, 1).toUpperCase(),
      memberIds: [me],
      channelIds: [channelId],
      ownerId: me,
    }
    const channel: Channel = {
      id: channelId,
      serverId: id,
      name: 'general',
      nameKa: 'ზოგადი',
      kind: 'text',
    }
    set((s) => ({
      servers: [...s.servers, server],
      channels: [...s.channels, channel],
      createServerOpen: false,
      activeServerId: id,
      activeChannelId: channelId,
      view: 'server',
    }))
    get().showToast('Community created')
    get().persist()
  },

  createChannel: (name, nameKa, kind) => {
    const serverId = get().activeServerId
    if (!serverId) return
    const id = uid('c')
    const channel: Channel = {
      id,
      serverId,
      name: name || 'channel',
      nameKa: nameKa || name || 'არხი',
      kind,
    }
    set((s) => ({
      channels: [...s.channels, channel],
      servers: s.servers.map((srv) =>
        srv.id === serverId
          ? { ...srv, channelIds: [...srv.channelIds, id] }
          : srv,
      ),
      createChannelOpen: false,
      activeChannelId: id,
      view: kind === 'voice' ? 'voice' : 'server',
    }))
    if (kind === 'voice') get().joinVoice(id)
    get().showToast('Channel created')
    get().persist()
  },

  setCreateServerOpen: (open) => set({ createServerOpen: open }),
  setCreateChannelOpen: (open) => set({ createChannelOpen: open }),

  joinVoice: (channelId) => {
    const me = get().session?.userId ?? CURRENT_USER_ID
    const others = get()
      .users.filter((u) => u.id !== me && u.presence === 'online')
      .slice(0, 2)
    set({
      voice: {
        channelId,
        videoOn: false,
        screenSharing: false,
        participants: [
          { userId: me, muted: false, deafened: false, speaking: true, sharingScreen: false },
          ...others.map((u, i) => ({
            userId: u.id,
            muted: i === 1,
            deafened: false,
            speaking: i === 0,
            sharingScreen: false,
          })),
        ],
      },
      view: 'voice',
    })
  },

  leaveVoice: () => {
    set({
      voice: {
        channelId: null,
        participants: [],
        videoOn: false,
        screenSharing: false,
      },
    })
  },

  toggleMute: () => {
    const me = get().session?.userId
    set((s) => ({
      voice: {
        ...s.voice,
        participants: s.voice.participants.map((p) =>
          p.userId === me ? { ...p, muted: !p.muted, speaking: p.muted } : p,
        ),
      },
    }))
  },

  toggleDeafen: () => {
    const me = get().session?.userId
    set((s) => ({
      voice: {
        ...s.voice,
        participants: s.voice.participants.map((p) =>
          p.userId === me ? { ...p, deafened: !p.deafened, muted: !p.deafened || p.muted } : p,
        ),
      },
    }))
  },

  toggleVideo: () => set((s) => ({ voice: { ...s.voice, videoOn: !s.voice.videoOn } })),
  toggleScreenShare: () =>
    set((s) => {
      const me = s.session?.userId
      const nextSharing = !s.voice.screenSharing
      return {
        voice: {
          ...s.voice,
          screenSharing: nextSharing,
          participants: s.voice.participants.map((p) =>
            p.userId === me ? { ...p, sharingScreen: nextSharing } : p,
          ),
        },
      }
    }),

  toggleBotInstall: (botId) => {
    set((s) => ({
      bots: s.bots.map((b) =>
        b.id === botId
          ? {
              ...b,
              installed: !b.installed,
              installs: b.installed ? b.installs - 1 : b.installs + 1,
            }
          : b,
      ),
    }))
    get().persist()
  },

  publishFeedPost: (content, contentKa) => {
    const me = get().session?.userId
    if (!me || !content.trim()) return
    const post: FeedPost = {
      id: uid('p'),
      authorId: me,
      serverId: get().activeServerId ?? undefined,
      content: content.trim(),
      contentKa: (contentKa || content).trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByMe: false,
      comments: 0,
    }
    set((s) => ({ feedPosts: [post, ...s.feedPosts] }))
    get().persist()
  },

  toggleFeedLike: (postId) => {
    set((s) => ({
      feedPosts: s.feedPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    }))
    get().persist()
  },

  addFile: (name) => {
    const me = get().session?.userId ?? CURRENT_USER_ID
    set((s) => ({
      files: [
        {
          id: uid('f'),
          name,
          sizeLabel: `${Math.max(12, Math.round(Math.random() * 800))} KB`,
          sharedBy: me,
          channelId: s.activeChannelId ?? 'c-general',
          createdAt: new Date().toISOString(),
        },
        ...s.files,
      ],
    }))
    get().showToast('File shared (local)')
    get().persist()
  },

  askAi: (prompt) => {
    const text = prompt.trim()
    if (!text) return
    const locale = get().locale
    const reply =
      locale === 'ka'
        ? `AI (mock): მივიღე — „${text}“. Phase 2-ში ეს რეალურ მოდელს დაუკავშირდება ქართული კონტექსტით.`
        : `AI (mock): Got it — “${text}”. Phase 2 will connect a real model with Georgian context.`
    set((s) => ({
      aiThread: [
        ...s.aiThread,
        { role: 'user', text },
        { role: 'assistant', text: reply },
      ],
    }))
  },

  login: (email, _password) => {
    set({
      session: {
        userId: CURRENT_USER_ID,
        token: `mock-${email || 'user'}`,
        mock: true,
      },
      view: 'dashboard',
    })
    get().showToast('Signed in (mock)')
    get().persist()
  },

  logout: () => {
    set({ session: null, view: 'dashboard' })
    get().persist()
  },

  register: (username, email, _password) => {
    const id = uid('u')
    const user: User = {
      id,
      username: username || 'newuser',
      displayName: username || 'New User',
      displayNameKa: username || 'ახალი მომხმარებელი',
      avatarHue: Math.floor(Math.random() * 360),
      status: 'New on GEOTALK',
      statusKa: 'ახალი GEOTALK-ზე',
      presence: 'online',
      bio: '',
      bioKa: '',
      joinedAt: new Date().toISOString().slice(0, 10),
      roles: ['member'],
    }
    set((s) => ({
      users: [...s.users, user],
      session: { userId: id, token: `mock-${email}`, mock: true },
      view: 'dashboard',
    }))
    get().showToast('Account created (mock)')
    get().persist()
  },

  showToast: (msg) => {
    set({ toast: msg })
    window.setTimeout(() => {
      if (get().toast === msg) set({ toast: null })
    }, 2600)
  },

  clearToast: () => set({ toast: null }),

  bootstrapMockRealtime: () => {
    set({ mockRealtimeConnected: true })
    const phrases = [
      { authorId: 'u-nino', content: 'Realtime mock tick — still here.', contentKa: 'Realtime mock ტიკი — აქ ვარ.' },
      { authorId: 'u-giorgi', content: 'Motion check: sidebar still smooth?', contentKa: 'მოძრაობის შემოწმება: საიდბარი ჯერ კიდევ რბილია?' },
      { authorId: 'u-mariam', content: 'Presence heartbeat ok.', contentKa: 'Presence heartbeat კარგია.' },
    ]
    const timer = window.setInterval(() => {
      const channelId = get().activeChannelId
      if (!channelId || get().view !== 'server') return
      if (Math.random() > 0.35) return
      const pick = phrases[Math.floor(Math.random() * phrases.length)]
      const msg: ChatMessage = {
        id: uid('rt'),
        channelId,
        authorId: pick.authorId,
        content: pick.content,
        contentKa: pick.contentKa,
        createdAt: new Date().toISOString(),
      }
      set((s) => ({ messages: [...s.messages, msg] }))
      get().persist()
    }, 28000)
    return () => {
      window.clearInterval(timer)
      set({ mockRealtimeConnected: false })
    }
  },
}))
