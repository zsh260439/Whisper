<template>
  <div class="flex h-screen w-screen">
    <ChatSidebar
      :conversations="conversations"
      :selectedId="selectedConversationId"
      @select="selectedConversationId = $event"
    />
    <ChatWindow
      :conversation="currentConversation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
    avatarColor: '#8FA89A',
    lastMessage: '好的，明天见！',
    lastTime: '刚刚',
    unread: 2,
    online: true,
    isGroup: false,
    messages: [
      { id: 1, senderId: 1, senderName: '林小溪', content: '你好，最近怎么样？', time: '14:20', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '还不错！你呢？', time: '14:22', isMine: true },
      { id: 3, senderId: 1, senderName: '林小溪', content: '挺好的，明天有空一起喝咖啡吗？', time: '14:25', isMine: false },
      { id: 4, senderId: 0, senderName: '我', content: '好啊，什么时候？', time: '14:28', isMine: true },
      { id: 5, senderId: 1, senderName: '林小溪', content: '下午两点怎么样？老地方', time: '14:30', isMine: false },
      { id: 6, senderId: 0, senderName: '我', content: '没问题，到时候见！', time: '14:32', isMine: true },
      { id: 7, senderId: 1, senderName: '林小溪', content: '好的，明天见！', time: '14:33', isMine: false },
    ],
  },
  {
    id: 2,
    name: '产品设计组',
    avatar: '产',
    avatarColor: '#7B93A8',
    lastMessage: '[张明]: 设计稿已经更新了',
    lastTime: '10分钟前',
    unread: 5,
    online: false,
    isGroup: true,
    messages: [
      { id: 1, senderId: 2, senderName: '张明', content: '大家好，新版本的设计稿完成了', time: '09:00', isMine: false },
      { id: 2, senderId: 3, senderName: '王芳', content: '看起来很棒！配色方案我很喜欢', time: '09:05', isMine: false },
      { id: 3, senderId: 0, senderName: '我', content: '字体可以再调大一点吗？', time: '09:10', isMine: true },
      { id: 4, senderId: 2, senderName: '张明', content: '好的，我调整一下', time: '09:15', isMine: false },
      { id: 5, senderId: 2, senderName: '张明', content: '设计稿已经更新了', time: '10:20', isMine: false },
    ],
  },
  {
    id: 3,
    name: '陈思远',
    avatar: '陈',
    avatarColor: '#C4A882',
    lastMessage: '周末一起去爬山吧',
    lastTime: '1小时前',
    unread: 0,
    online: true,
    isGroup: false,
    messages: [
      { id: 1, senderId: 4, senderName: '陈思远', content: '周末有安排吗？', time: '昨天', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '还没有呢，你有什么建议？', time: '昨天', isMine: true },
      { id: 3, senderId: 4, senderName: '陈思远', content: '周末一起去爬山吧', time: '1小时前', isMine: false },
    ],
  },
  {
    id: 4,
    name: '李雨晨',
    avatar: '李',
    avatarColor: '#C9918A',
    lastMessage: '那首歌太好听了！',
    lastTime: '昨天',
    unread: 1,
    online: false,
    isGroup: false,
    messages: [
      { id: 1, senderId: 0, senderName: '我', content: '给你推荐一首歌，你听过吗？', time: '昨天', isMine: true },
      { id: 2, senderId: 5, senderName: '李雨晨', content: '那首歌太好听了！', time: '昨天', isMine: false },
    ],
  },
  {
    id: 5,
    name: '前端技术交流',
    avatar: '前',
    avatarColor: '#A899C9',
    lastMessage: '[王磊]: Vue 3.5 新特性了解一下',
    lastTime: '昨天',
    unread: 0,
    online: false,
    isGroup: true,
    messages: [
      { id: 1, senderId: 6, senderName: '王磊', content: '大家看过 Vue 3.5 的新特性了吗？', time: '昨天', isMine: false },
      { id: 2, senderId: 0, senderName: '我', content: '看到了，响应式系统有很大的优化', time: '昨天', isMine: true },
      { id: 3, senderId: 6, senderName: '王磊', content: 'Vue 3.5 新特性了解一下', time: '昨天', isMine: false },
    ],
  },
  {
    id: 6,
    name: '赵文博',
    avatar: '赵',
    avatarColor: '#6B8B7A',
    lastMessage: '收到，谢谢！',
    lastTime: '周三',
    unread: 0,
    online: false,
    isGroup: false,
    messages: [
      { id: 1, senderId: 0, senderName: '我', content: '文档发你了，看一下', time: '周三', isMine: true },
      { id: 2, senderId: 7, senderName: '赵文博', content: '收到，谢谢！', time: '周三', isMine: false },
    ],
  },
])

const selectedConversationId = ref(1)

const currentConversation = computed(() =>
  conversations.value.find(c => c.id === selectedConversationId.value)
)
</script>
