export type MessageType = 'text' | 'image'

export interface Message {
  id: number
  senderId: number
  senderName: string
  content: string
  time: string
  isMine: boolean
  type: MessageType
  imageUrl?: string
}

export interface UserProfile {
  id: number
  name: string
  account: string
  avatar: string
  avatarColor: string
  avatarImageUrl?: string
  online: boolean
  signature: string
}

export interface GroupMeta {
  groupId: string
  memberIds: number[]
  memberCount: number
}

export interface Conversation {
  id: number
  name: string
  avatar: string
  avatarColor: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  isGroup: boolean
  messages: Message[]
  peerUserId?: number
  groupMeta?: GroupMeta
}

export interface CreateGroupPayload {
  name: string
  avatar: string
  avatarColor: string
  memberIds: number[]
}

export interface UpdateCurrentUserPayload {
  name: string
  signature: string
  avatarImageUrl?: string
}

export interface InviteGroupMembersPayload {
  conversationId: number
  memberIds: number[]
}

export interface MessageImagePayload {
  imageUrl: string
  content: string
}

export interface GroupAvatarOption {
  label: string
  color: string
}

export interface EmojiGroup {
  key: string
  label: string
  emojis: string[]
}

export interface SidebarTab {
  key: 'messages' | 'contacts' | 'groups' | 'discover'
  label: string
}
