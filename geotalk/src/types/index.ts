export type Locale = 'ka' | 'en'

export type Presence = 'online' | 'idle' | 'dnd' | 'offline'

export type ChannelKind = 'text' | 'voice' | 'announcement'

export type RoleId = 'owner' | 'admin' | 'moderator' | 'member' | 'guest'

export interface User {
  id: string
  username: string
  displayName: string
  displayNameKa: string
  avatarHue: number
  status: string
  statusKa: string
  presence: Presence
  bio: string
  bioKa: string
  joinedAt: string
  roles: RoleId[]
}

export interface Channel {
  id: string
  serverId: string
  name: string
  nameKa: string
  kind: ChannelKind
  topic?: string
  topicKa?: string
  unread?: number
}

export interface Server {
  id: string
  name: string
  nameKa: string
  description: string
  descriptionKa: string
  accent: string
  iconLetter: string
  memberIds: string[]
  channelIds: string[]
  ownerId: string
}

export interface MessageAttachment {
  id: string
  name: string
  sizeLabel: string
  kind: 'image' | 'file' | 'audio'
}

export interface ChatMessage {
  id: string
  channelId: string
  authorId: string
  content: string
  contentKa?: string
  createdAt: string
  edited?: boolean
  reactions?: { emoji: string; count: number; me?: boolean }[]
  attachments?: MessageAttachment[]
}

export interface DirectThread {
  id: string
  participantIds: string[]
  lastMessageAt: string
  unread: number
}

export interface FriendRequest {
  id: string
  fromUserId: string
  toUserId: string
  status: 'pending' | 'accepted' | 'declined'
}

export interface NotificationItem {
  id: string
  kind: 'mention' | 'friend' | 'system' | 'call' | 'ai'
  title: string
  titleKa: string
  body: string
  bodyKa: string
  createdAt: string
  read: boolean
}

export interface FeedPost {
  id: string
  authorId: string
  serverId?: string
  content: string
  contentKa: string
  createdAt: string
  likes: number
  likedByMe: boolean
  comments: number
}

export interface BotListing {
  id: string
  name: string
  nameKa: string
  description: string
  descriptionKa: string
  installs: number
  category: string
  categoryKa: string
  installed: boolean
}

export interface VoiceParticipant {
  userId: string
  muted: boolean
  deafened: boolean
  speaking: boolean
  sharingScreen: boolean
}

export interface VoiceRoomState {
  channelId: string | null
  participants: VoiceParticipant[]
  videoOn: boolean
  screenSharing: boolean
}

export type AppView =
  | 'dashboard'
  | 'server'
  | 'dms'
  | 'friends'
  | 'voice'
  | 'feed'
  | 'bots'
  | 'search'
  | 'ai'
  | 'notifications'
  | 'profile'
  | 'admin'
  | 'settings'
  | 'files'

export interface AuthSession {
  userId: string
  token: string
  /** Phase 2: replace with real JWT from API */
  mock: true
}
