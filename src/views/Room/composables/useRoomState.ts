import { computed, ref } from 'vue'
import { CURRENT_USER_ID } from '@/constants/room'
import { createInitialConversations, createInitialUserProfiles } from '@/mock/room'
import {
  appendOutgoingMessage,
  createGroupConversation,
  createImageMessage,
  createJoinedGroupConversation,
  createTextMessage,
  createUserProfile,
  ensureDirectConversation,
  inviteMembersToGroup,
  updateCurrentUserProfile,
} from '@/services/room'
import type {
  Conversation,
  CreateGroupPayload,
  InviteGroupMembersPayload,
  MessageImagePayload,
  UpdateCurrentUserPayload,
  UserProfile,
} from '@/types/room'

export const useRoomState = () => {
  const userProfiles = ref(createInitialUserProfiles())
  const conversations = ref(createInitialConversations())
  const selectedConversationId = ref(conversations.value[0]?.id ?? 0)

  const getUserProfile = (userId: number) =>
    userProfiles.value.find(profile => profile.id === userId)

  const currentConversation = computed(() =>
    conversations.value.find(conversation => conversation.id === selectedConversationId.value),
  )

  const currentUserProfile = computed(() =>
    getUserProfile(CURRENT_USER_ID) as UserProfile,
  )

  const peerProfile = computed(() => {
    const conversation = currentConversation.value

    if (!conversation || conversation.isGroup || typeof conversation.peerUserId !== 'number')
      return undefined

    return getUserProfile(conversation.peerUserId)
  })

  const friendUserIds = computed(() =>
    conversations.value
      .filter(conversation => !conversation.isGroup && typeof conversation.peerUserId === 'number')
      .map(conversation => conversation.peerUserId as number),
  )

  const groupMembers = computed(() => {
    const conversation = currentConversation.value

    if (!conversation?.isGroup || !conversation.groupMeta)
      return []

    return conversation.groupMeta.memberIds
      .map(memberId => getUserProfile(memberId))
      .filter((profile): profile is UserProfile => Boolean(profile))
  })

  const groupInviteCandidates = computed(() => {
    const conversation = currentConversation.value

    if (!conversation?.isGroup || !conversation.groupMeta)
      return []

    const memberIdSet = new Set(conversation.groupMeta.memberIds)

    return userProfiles.value.filter(profile =>
      profile.id !== CURRENT_USER_ID && !memberIdSet.has(profile.id),
    )
  })

  const selectConversation = (conversation: Conversation) => {
    selectedConversationId.value = conversation.id
    conversation.unread = 0
  }

  const handleSelectConversation = (id: number) => {
    const selectedConversation = conversations.value.find(conversation => conversation.id === id)
    if (selectedConversation)
      selectConversation(selectedConversation)
  }

  const handleAddContact = (account: string) => {
    const matchedProfile = userProfiles.value.find(profile =>
      profile.account === account || profile.name === account,
    )

    const profile = matchedProfile ?? createUserProfile(account, userProfiles.value)

    if (!matchedProfile)
      userProfiles.value.push(profile)

    const conversation = ensureDirectConversation(conversations.value, profile, '已添加为联系人，可以开始聊天了。')
    selectConversation(conversation)
  }

  const handleCreateGroup = (payload: CreateGroupPayload) => {
    const existingConversation = conversations.value.find(conversation =>
      conversation.isGroup && conversation.name === payload.name,
    )

    if (existingConversation) {
      selectConversation(existingConversation)
      return
    }

    const conversation = createGroupConversation(payload)
    conversations.value.unshift(conversation)
    selectConversation(conversation)
  }

  const handleJoinGroup = (groupCode: string) => {
    const existingConversation = conversations.value.find(conversation =>
      conversation.isGroup && conversation.groupMeta?.groupId === groupCode,
    )

    if (existingConversation) {
      selectConversation(existingConversation)
      return
    }

    const conversation = createJoinedGroupConversation(groupCode)
    conversations.value.unshift(conversation)
    selectConversation(conversation)
  }

  const handleAddFriend = (userId: number) => {
    const profile = getUserProfile(userId)
    if (!profile)
      return

    ensureDirectConversation(conversations.value, profile, '已从群成员添加为好友，可以开始聊天了。')
  }

  const handleUpdateCurrentUser = (payload: UpdateCurrentUserPayload) => {
    const profile = getUserProfile(CURRENT_USER_ID)
    if (!profile)
      return

    updateCurrentUserProfile(profile, conversations.value, payload)
  }

  const handleInviteGroupMembers = (payload: InviteGroupMembersPayload) => {
    inviteMembersToGroup(conversations.value, userProfiles.value, payload, currentUserProfile.value.name)
  }

  const sendTextMessage = (content: string) => {
    const conversation = currentConversation.value
    const trimmed = content.trim()

    if (!conversation || !trimmed)
      return

    appendOutgoingMessage(
      conversation,
      createTextMessage(CURRENT_USER_ID, currentUserProfile.value.name, trimmed),
    )
  }

  const sendImageMessage = (payload: MessageImagePayload) => {
    const conversation = currentConversation.value

    if (!conversation)
      return

    appendOutgoingMessage(
      conversation,
      createImageMessage(CURRENT_USER_ID, currentUserProfile.value.name, payload),
    )
  }

  return {
    conversations,
    selectedConversationId,
    currentConversation,
    currentUserProfile,
    peerProfile,
    friendUserIds,
    groupMembers,
    groupInviteCandidates,
    handleSelectConversation,
    handleAddContact,
    handleCreateGroup,
    handleJoinGroup,
    handleAddFriend,
    handleUpdateCurrentUser,
    handleInviteGroupMembers,
    sendTextMessage,
    sendImageMessage,
  }
}
