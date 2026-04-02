<template>
  <div class="h-screen w-screen flex overflow-hidden bg-[#fcfbf9]">
    <ChatSidebar
      :conversations="conversations"
      :current-user="currentUserProfile"
      :selected-id="selectedConversationId"
      @select="handleSelectConversation"
      @add-contact="handleAddContact"
      @create-group="handleCreateGroup"
      @join-group="handleJoinGroup"
      @update-current-user="handleUpdateCurrentUser"
    />
    <ChatWindow
      :conversation="currentConversation"
      :current-user-id="CURRENT_USER_ID"
      :current-user-profile="currentUserProfile"
      :peer-profile="peerProfile"
      :friend-user-ids="friendUserIds"
      :group-members="groupMembers"
      :group-invite-candidates="groupInviteCandidates"
      @add-friend="handleAddFriend"
      @invite-group-members="handleInviteGroupMembers"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatWindow from '@/components/ChatWindow.vue'

export interface Message {
  id: number
  senderId: number
  senderName: string
  content: string
  time: string
  isMine: boolean
  type?: 'text' | 'image'
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

interface CreateGroupPayload {
  name: string
  avatar: string
  avatarColor: string
  memberIds: number[]
}

const CURRENT_USER_ID = 0
const avatarPalette = ['#91A896', '#8097AA', '#CAA97F', '#D4A39B', '#8AA1B8', '#C89289', '#7E9D8E', '#A68AC0']

const formatTime = () =>
  new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const getAvatarColor = (seed: string) => {
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return avatarPalette[total % avatarPalette.length]
}

const getAvatarLabel = (name: string, isGroup: boolean) => {
  if (isGroup)
    return '群'

  return name.trim().slice(0, 1).toUpperCase() || '聊'
}

const createGroupId = () => String(Math.floor(100000 + Math.random() * 900000))

const userProfiles = ref<UserProfile[]>([
  { id: CURRENT_USER_ID, name: '我', account: 'me', avatar: '我', avatarColor: '#C4A882', online: true, signature: '在做一个更顺手的聊天项目。' },
  { id: 1, name: '林小溪', account: 'linxiaoxi', avatar: '林', avatarColor: '#91A896', online: true, signature: '周末只想去有风的地方。' },
  { id: 2, name: '张明', account: 'zhangming', avatar: '张', avatarColor: '#8097AA', online: true, signature: '想把每一个细节都落到体验里。' },
  { id: 3, name: '王琳', account: 'wanglin', avatar: '王', avatarColor: '#CAA97F', online: true, signature: '今天也在认真做设计。' },
  { id: 4, name: '陈思远', account: 'chensiyuan', avatar: '陈', avatarColor: '#D4A39B', online: true, signature: '先看问题，再谈方案。' },
  { id: 5, name: '李华', account: 'lihua', avatar: '李', avatarColor: '#8AA1B8', online: false, signature: '最近沉迷阅读和记录。' },
  { id: 6, name: '王佳宁', account: 'wangjianing', avatar: '王', avatarColor: '#8AA1B8', online: false, signature: '照片和色调都要刚刚好。' },
  { id: 7, name: '苏晓晴', account: 'suxiaoqing', avatar: '苏', avatarColor: '#C89289', online: false, signature: '好久不见，也要慢慢变好。' },
  { id: 8, name: '周舟', account: 'zhouzhou', avatar: '周', avatarColor: '#7E9D8E', online: true, signature: '在路上，也在写点东西。' },
  { id: 9, name: '许诺', account: 'xunuo', avatar: '许', avatarColor: '#A68AC0', online: false, signature: '把复杂的事情说简单一点。' },
])

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: '林小溪',
    avatar: '林',
    avatarColor: '#91A896',
    lastMessage: '周末一起去爬山吗？',
    lastTime: '14:32',
    unread: 2,
    online: true,
    isGroup: false,
    peerUserId: 1,
    messages: [
      { id: 1, senderId: 1, senderName: '林小溪', content: '最近在忙什么呀，好久没联系了。', time: '14:10', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '在做一个即时通讯项目，最近都在调界面。', time: '14:15', isMine: true },
      { id: 3, senderId: 1, senderName: '林小溪', content: '那挺适合你呀，做得怎么样了？', time: '14:18', isMine: false },
      { id: 4, senderId: 0, senderName: '我', content: '差不多了，还在优化聊天页细节。', time: '14:22', isMine: true },
      { id: 5, senderId: 1, senderName: '林小溪', content: '周末一起去爬山吗？', time: '14:32', isMine: false },
    ],
  },
  {
    id: 2,
    name: '产品设计组',
    avatar: '组',
    avatarColor: '#8097AA',
    lastMessage: '[张明] 新版原型已经上传了',
    lastTime: '13:15',
    unread: 5,
    online: false,
    isGroup: true,
    groupMeta: {
      groupId: '602314',
      memberIds: [CURRENT_USER_ID, 2, 3, 6],
      memberCount: 4,
    },
    messages: [
      { id: 1, senderId: 2, senderName: '张明', content: '新版原型已经上传了，大家可以开始看细节。', time: '12:42', isMine: false },
      { id: 2, senderId: 3, senderName: '王琳', content: '整体节奏挺好，颜色也更统一了。', time: '12:55', isMine: false },
      { id: 3, senderId: 0, senderName: '我', content: '聊天页我会继续往更轻的方向调整。', time: '13:06', isMine: true },
      { id: 4, senderId: 2, senderName: '张明', content: '可以，重点把圆角和留白做舒服。', time: '13:15', isMine: false },
    ],
  },
  {
    id: 3,
    name: '陈思远',
    avatar: '陈',
    avatarColor: '#CAA97F',
    lastMessage: '收到，我看看',
    lastTime: '昨天',
    unread: 0,
    online: true,
    isGroup: false,
    peerUserId: 4,
    messages: [
      { id: 1, senderId: 0, senderName: '我', content: '我把设计稿发你了，帮我看看聊天页氛围够不够轻。', time: '昨天', isMine: true },
      { id: 2, senderId: 4, senderName: '陈思远', content: '收到，我看看。', time: '昨天', isMine: false },
    ],
  },
  {
    id: 4,
    name: '读书会',
    avatar: '书',
    avatarColor: '#D4A39B',
    lastMessage: '[李华] 这周阅读主题发群里了',
    lastTime: '昨天',
    unread: 0,
    online: false,
    isGroup: true,
    groupMeta: {
      groupId: '458203',
      memberIds: [CURRENT_USER_ID, 4, 5, 7],
      memberCount: 4,
    },
    messages: [
      { id: 1, senderId: 5, senderName: '李华', content: '这周阅读主题发群里了，大家有空可以先看。', time: '昨天', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '我先看《设计中的留白》。', time: '昨天', isMine: true },
    ],
  },
  {
    id: 5,
    name: '王佳宁',
    avatar: '王',
    avatarColor: '#8AA1B8',
    lastMessage: '照片发给你了，看看效果怎么样',
    lastTime: '周一',
    unread: 0,
    online: false,
    isGroup: false,
    peerUserId: 6,
    messages: [
      { id: 1, senderId: 6, senderName: '王佳宁', content: '照片发给你了，看看效果怎么样。', time: '周一', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '收到，整体氛围不错，色调也很干净。', time: '周一', isMine: true },
    ],
  },
  {
    id: 6,
    name: '苏晓晴',
    avatar: '苏',
    avatarColor: '#C89289',
    lastMessage: '好久不见呀，最近怎么样？',
    lastTime: '上周',
    unread: 0,
    online: false,
    isGroup: false,
    peerUserId: 7,
    messages: [
      { id: 1, senderId: 7, senderName: '苏晓晴', content: '好久不见呀，最近怎么样？', time: '上周', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '最近都在做这个聊天项目，细节改了不少。', time: '上周', isMine: true },
    ],
  },
])

const selectedConversationId = ref(1)

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
    .map(memberId => userProfiles.value.find(profile => profile.id === memberId))
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

const createConversation = (
  name: string,
  isGroup: boolean,
  lastMessage: string,
  options: {
    avatar?: string
    avatarColor?: string
    online?: boolean
    peerUserId?: number
    groupMeta?: GroupMeta
  } = {},
): Conversation => {
  const time = formatTime()

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
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

const getUserProfile = (userId: number) =>
  userProfiles.value.find(profile => profile.id === userId)

const createUserProfile = (account: string): UserProfile => {
  const id = Math.max(...userProfiles.value.map(profile => profile.id), CURRENT_USER_ID) + 1
  const profile: UserProfile = {
    id,
    name: account,
    account,
    avatar: getAvatarLabel(account, false),
    avatarColor: getAvatarColor(account),
    online: false,
    signature: '这个人还没有留下签名。',
  }

  userProfiles.value.push(profile)
  return profile
}

const ensureDirectConversation = (profile: UserProfile, initialMessage: string) => {
  const existingConversation = conversations.value.find(conversation =>
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

  conversations.value.unshift(conversation)
  return conversation
}

const selectConversation = (conversation: Conversation) => {
  selectedConversationId.value = conversation.id
  conversation.unread = 0
}

const handleSelectConversation = (id: number) => {
  const selectedConversation = conversations.value.find(conversation => conversation.id === id)

  if (!selectedConversation)
    return

  selectConversation(selectedConversation)
}

const handleAddContact = (account: string) => {
  const matchedProfile = userProfiles.value.find(profile =>
    profile.account === account || profile.name === account,
  )
  const profile = matchedProfile ?? createUserProfile(account)
  const conversation = ensureDirectConversation(profile, '已添加为联系人，可以开始聊天了。')
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

  const groupId = createGroupId()
  const groupMeta: GroupMeta = {
    groupId,
    memberIds: [CURRENT_USER_ID, ...payload.memberIds],
    memberCount: payload.memberIds.length + 1,
  }

  const conversation = createConversation(
    payload.name,
    true,
    `群聊已创建，群号 ${groupId}`,
    {
      avatar: payload.avatar,
      avatarColor: payload.avatarColor,
      online: false,
      groupMeta,
    },
  )

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

  const conversation = createConversation(
    `群聊 ${groupCode}`,
    true,
    `已加入群聊 ${groupCode}`,
    {
      avatar: '群',
      avatarColor: getAvatarColor(groupCode),
      online: false,
      groupMeta: {
        groupId: groupCode,
        memberIds: [CURRENT_USER_ID],
        memberCount: 1,
      },
    },
  )

  conversations.value.unshift(conversation)
  selectConversation(conversation)
}

const handleAddFriend = (userId: number) => {
  const profile = getUserProfile(userId)

  if (!profile)
    return

  ensureDirectConversation(profile, '已从群成员添加为好友，可以开始聊天了。')
}

const handleUpdateCurrentUser = (payload: { name: string, signature: string, avatarImageUrl?: string }) => {
  const profile = getUserProfile(CURRENT_USER_ID)

  if (!profile)
    return

  const nextName = payload.name.trim()
  if (!nextName)
    return

  profile.name = nextName
  profile.signature = payload.signature.trim()
  profile.avatar = getAvatarLabel(nextName, false)
  profile.avatarImageUrl = payload.avatarImageUrl

  conversations.value.forEach((conversation) => {
    conversation.messages.forEach((message) => {
      if (message.senderId === CURRENT_USER_ID)
        message.senderName = nextName
    })
  })
}

const handleInviteGroupMembers = (payload: { conversationId: number, memberIds: number[] }) => {
  const targetConversation = conversations.value.find(conversation =>
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
    .map(memberId => getUserProfile(memberId)?.name)
    .filter((name): name is string => Boolean(name))
    .join('、')

  const time = formatTime()

  targetConversation.messages.push({
    id: Date.now(),
    senderId: CURRENT_USER_ID,
    senderName: currentUserProfile.value.name,
    content: `邀请 ${invitedNames} 加入了群聊。`,
    time,
    isMine: true,
  })

  targetConversation.lastMessage = `你邀请了 ${invitedNames}`
  targetConversation.lastTime = time
}
</script>
