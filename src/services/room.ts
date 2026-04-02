import { CURRENT_USER_ID, DEFAULT_SIGNATURE } from '@/constants/room'
import type {
  Conversation,
  CreateGroupPayload,
  InviteGroupMembersPayload,
  Message,
  MessageImagePayload,
  UpdateCurrentUserPayload,
  UserProfile,
} from '@/types/room'
import {
  createGroupId,
  createRuntimeId,
  formatTime,
  getAvatarColor,
  getAvatarLabel,
  getConversationPreview,
} from '@/utils/room'

export const createUserProfile = (account: string, profiles: UserProfile[]): UserProfile => {
  const id = Math.max(...profiles.map(profile => profile.id), CURRENT_USER_ID) + 1

  return {
    id,
    name: account,
    account,
    avatar: getAvatarLabel(account),
    avatarColor: getAvatarColor(account),
    online: false,
    signature: DEFAULT_SIGNATURE,
  }
}

export const createConversation = (
  name: string,
  isGroup: boolean,
  lastMessage: string,
  options: {
    avatar?: string
    avatarColor?: string
    online?: boolean
    peerUserId?: number
    groupMeta?: Conversation['groupMeta']
  } = {},
): Conversation => {
  const time = formatTime()

  return {
    id: createRuntimeId(),
    name,
    avatar: options.avatar ?? getAvatarLabel(name, isGroup),
    avatarColor: options.avatarColor ?? getAvatarColor(name),
    lastMessage,
    lastTime: time,
    unread: 0,
    online: options.online ?? !isGroup,
    isGroup,
    messages: [],
    peerUserId: options.peerUserId,
    groupMeta: options.groupMeta,
  }
}

export const ensureDirectConversation = (
  conversations: Conversation[],
  profile: UserProfile,
  initialMessage: string,
) => {
  const existingConversation = conversations.find(conversation =>
    !conversation.isGroup && conversation.peerUserId === profile.id,
  )

  if (existingConversation)
    return existingConversation

  const conversation = createConversation(profile.name, false, initialMessage, {
    avatar: profile.avatar,
    avatarColor: profile.avatarColor,
    online: profile.online,
    peerUserId: profile.id,
  })

  conversations.unshift(conversation)
  return conversation
}

export const createTextMessage = (
  senderId: number,
  senderName: string,
  content: string,
): Message => ({
  id: createRuntimeId(),
  senderId,
  senderName,
  content: content.trim(),
  time: formatTime(),
  isMine: senderId === CURRENT_USER_ID,
  type: 'text',
})

export const createImageMessage = (
  senderId: number,
  senderName: string,
  payload: MessageImagePayload,
): Message => ({
  id: createRuntimeId(),
  senderId,
  senderName,
  content: payload.content,
  time: formatTime(),
  isMine: senderId === CURRENT_USER_ID,
  type: 'image',
  imageUrl: payload.imageUrl,
})

export const appendOutgoingMessage = (conversation: Conversation, message: Message) => {
  conversation.messages.push(message)
  conversation.lastMessage = getConversationPreview(message)
  conversation.lastTime = message.time
  conversation.unread = 0
}

export const createGroupConversation = (payload: CreateGroupPayload) => {
  const groupId = createGroupId()

  return createConversation(payload.name, true, `群聊已创建，群号 ${groupId}`, {
    avatar: payload.avatar,
    avatarColor: payload.avatarColor,
    online: false,
    groupMeta: {
      groupId,
      memberIds: [CURRENT_USER_ID, ...payload.memberIds],
      memberCount: payload.memberIds.length + 1,
    },
  })
}

export const createJoinedGroupConversation = (groupCode: string) =>
  createConversation(`群聊 ${groupCode}`, true, `已加入群聊 ${groupCode}`, {
    avatar: '群',
    avatarColor: getAvatarColor(groupCode),
    online: false,
    groupMeta: {
      groupId: groupCode,
      memberIds: [CURRENT_USER_ID],
      memberCount: 1,
    },
  })

export const updateCurrentUserProfile = (
  currentUser: UserProfile,
  conversations: Conversation[],
  payload: UpdateCurrentUserPayload,
) => {
  const nextName = payload.name.trim()
  if (!nextName)
    return

  currentUser.name = nextName
  currentUser.signature = payload.signature.trim()
  currentUser.avatar = getAvatarLabel(nextName)
  currentUser.avatarImageUrl = payload.avatarImageUrl

  conversations.forEach((conversation) => {
    conversation.messages.forEach((message) => {
      if (message.senderId === CURRENT_USER_ID)
        message.senderName = nextName
    })
  })
}

export const inviteMembersToGroup = (
  conversations: Conversation[],
  profiles: UserProfile[],
  payload: InviteGroupMembersPayload,
  currentUserName: string,
) => {
  const targetConversation = conversations.find(conversation =>
    conversation.id === payload.conversationId && conversation.isGroup,
  )

  if (!targetConversation?.groupMeta)
    return

  const existingMemberIds = new Set(targetConversation.groupMeta.memberIds)
  const newMemberIds = payload.memberIds.filter(memberId => !existingMemberIds.has(memberId))

  if (!newMemberIds.length)
    return

  targetConversation.groupMeta.memberIds = [...targetConversation.groupMeta.memberIds, ...newMemberIds]
  targetConversation.groupMeta.memberCount = targetConversation.groupMeta.memberIds.length

  const invitedNames = newMemberIds
    .map(memberId => profiles.find(profile => profile.id === memberId)?.name)
    .filter((name): name is string => Boolean(name))
    .join('、')

  const inviteMessage = createTextMessage(CURRENT_USER_ID, currentUserName, `邀请 ${invitedNames} 加入了群聊。`)
  appendOutgoingMessage(targetConversation, inviteMessage)
  targetConversation.lastMessage = `你邀请了 ${invitedNames}`
}
