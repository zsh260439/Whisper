<template>
  <div class="h-screen w-screen flex overflow-hidden bg-[#fcfbf9]">
    <ChatSidebar
      :conversations="conversations"
      :selected-id="selectedConversationId"
      @select="handleSelectConversation"
    />
    <ChatWindow :conversation="currentConversation" />
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
}

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: '林小溪',
    avatar: '林',
    avatarColor: '#91A896',
    lastMessage: '周末一起去爬山吧 🏔️',
    lastTime: '14:32',
    unread: 2,
    online: true,
    isGroup: false,
    messages: [
      { id: 1, senderId: 1, senderName: '林小溪', content: '最近在忙什么呢？好久没联系了', time: '14:10', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '在做一个新的项目，挺有意思的', time: '14:15', isMine: true },
      { id: 3, senderId: 1, senderName: '林小溪', content: '听起来不错！是什么类型的项目？', time: '14:18', isMine: false },
      { id: 4, senderId: 0, senderName: '我', content: '一个即时通讯应用，界面设计上花了不少心思', time: '14:22', isMine: true },
      { id: 5, senderId: 1, senderName: '林小溪', content: '哇，确实很适合做这类项目', time: '14:25', isMine: false },
      { id: 6, senderId: 0, senderName: '我', content: '是的，组件化开发效率很高', time: '14:28', isMine: true },
      { id: 7, senderId: 1, senderName: '林小溪', content: '周末一起去爬山吧 🏔️', time: '14:32', isMine: false },
    ],
  },
  {
    id: 2,
    name: '产品设计组',
    avatar: '产',
    avatarColor: '#8097AA',
    lastMessage: '[张明] 新版原型图已经上传了',
    lastTime: '13:15',
    unread: 5,
    online: false,
    isGroup: true,
    messages: [
      { id: 1, senderId: 2, senderName: '张明', content: '新版原型图已经上传了，大家可以开始看细节了', time: '12:42', isMine: false },
      { id: 2, senderId: 3, senderName: '王琳', content: '整体节奏很好，配色也更统一了', time: '12:55', isMine: false },
      { id: 3, senderId: 0, senderName: '我', content: '聊天页这块我会继续往柔和的方向调整', time: '13:06', isMine: true },
      { id: 4, senderId: 2, senderName: '张明', content: '可以，重点把留白和圆角质感做出来', time: '13:15', isMine: false },
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
    messages: [
      { id: 1, senderId: 0, senderName: '我', content: '设计稿我发你了，帮我看下聊天页氛围够不够轻一点', time: '昨天', isMine: true },
      { id: 2, senderId: 4, senderName: '陈思远', content: '收到，我看看', time: '昨天', isMine: false },
    ],
  },
  {
    id: 4,
    name: '读书会',
    avatar: '读',
    avatarColor: '#D4A39B',
    lastMessage: '[李华] 这个月的推荐书单出来了',
    lastTime: '昨天',
    unread: 0,
    online: false,
    isGroup: true,
    messages: [
      { id: 1, senderId: 5, senderName: '李华', content: '这个月的推荐书单出来了，大家挑一本感兴趣的吧', time: '昨天', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '我先看《设计中的留白》', time: '昨天', isMine: true },
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
    messages: [
      { id: 1, senderId: 6, senderName: '王佳宁', content: '照片发给你了，看看效果怎么样', time: '周一', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '收到，整体氛围很好，色调也很干净', time: '周一', isMine: true },
    ],
  },
  {
    id: 6,
    name: '苏晓晚',
    avatar: '苏',
    avatarColor: '#C89289',
    lastMessage: '好久不见呀！最近怎么样？',
    lastTime: '上周',
    unread: 0,
    online: false,
    isGroup: false,
    messages: [
      { id: 1, senderId: 7, senderName: '苏晓晚', content: '好久不见呀！最近怎么样？', time: '上周', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '在忙一个即时通讯项目，最近都在调界面', time: '上周', isMine: true },
    ],
  },
])

const selectedConversationId = ref(1)

const currentConversation = computed(() =>
  conversations.value.find(conversation => conversation.id === selectedConversationId.value)
)

const handleSelectConversation = (id: number) => {
  selectedConversationId.value = id

  const selectedConversation = conversations.value.find(conversation => conversation.id === id)

  if (selectedConversation) {
    selectedConversation.unread = 0
  }
}
</script>
