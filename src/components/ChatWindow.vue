<template>
  <main class="flex-1 min-w-0 flex flex-col h-full bg-surface-warm">
    <template v-if="conversation">
      <!-- Header -->
      <header class="flex items-center justify-between px-6 py-3 border-b border-ink-faint/20" style="backdrop-filter: blur(12px); background: rgba(250, 250, 249, 0.85);">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-light"
            :style="{ backgroundColor: conversation.avatarColor }"
          >
            {{ conversation.avatar }}
          </div>
          <div>
            <h3 class="text-sm font-normal text-ink">{{ conversation.name }}</h3>
            <p class="text-xs font-light flex items-center gap-1" :class="conversation.online ? 'text-green-500' : 'text-ink-muted'">
              <span class="w-1.5 h-1.5 rounded-full" :class="conversation.online ? 'bg-green-400' : 'bg-ink-faint'" />
              {{ conversation.online ? '在线' : '离线' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button class="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
            <i class="carbon:phone text-lg" />
          </button>
          <button class="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
            <i class="carbon:video text-lg" />
          </button>
          <button class="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
            <i class="carbon:search text-lg" />
          </button>
          <button class="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
            <i class="carbon:overflow-menu-vertical text-lg" />
          </button>
        </div>
      </header>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4">
        <!-- Date Separator -->
        <div class="flex items-center justify-center mb-6">
          <span class="px-3 py-1 rounded-full bg-primary-50 text-xs text-ink-muted font-light">今天</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="msg in conversation.messages"
            :key="msg.id"
            class="flex"
            :class="msg.isMine ? 'justify-end' : 'justify-start'"
          >
            <!-- Others' avatar -->
            <div v-if="!msg.isMine" class="flex-shrink-0 mr-3 self-end">
              <div
                v-if="!conversation.isGroup || !msg.isMine"
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-light"
                :style="{ backgroundColor: conversation.avatarColor }"
              >
                {{ conversation.avatar }}
              </div>
            </div>

            <div class="max-w-xs lg:max-w-md">
              <!-- Group sender name -->
              <p v-if="conversation.isGroup && !msg.isMine" class="text-xs text-primary-400 font-light mb-1 ml-1">
                {{ msg.senderName }}
              </p>

              <!-- Message Bubble -->
              <div
                class="px-4 py-2.5 text-sm font-light leading-relaxed"
                :class="msg.isMine
                  ? 'bg-primary text-white rounded-2xl rounded-tr-md'
                  : 'bg-surface border border-ink-faint/20 text-ink rounded-2xl rounded-tl-md'"
              >
                {{ msg.content }}
              </div>

              <!-- Time & Status -->
              <div class="flex items-center gap-1 mt-1" :class="msg.isMine ? 'justify-end' : 'justify-start'">
                <span class="text-xs text-ink-faint font-light">{{ msg.time }}</span>
                <i v-if="msg.isMine" class="carbon:checkmark text-xs text-primary-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-ink-faint/20 px-6 py-4" style="backdrop-filter: blur(12px); background: rgba(250, 250, 249, 0.85);">
        <!-- Toolbar -->
        <div class="flex items-center gap-1 mb-3">
          <button
            v-for="tool in tools"
            :key="tool.icon"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200"
          >
            <i :class="tool.icon" class="text-lg" />
          </button>
        </div>

        <!-- Textarea -->
        <el-input
          v-model="messageText"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="输入消息..."
          resize="none"
          class="chat-textarea"
        />

        <!-- Bottom Bar -->
        <div class="flex items-center justify-between mt-3">
          <span class="text-xs text-ink-faint font-light">Enter 发送 · Shift+Enter 换行</span>
          <button
            class="px-5 py-2 rounded-xl text-sm font-light tracking-wider transition-all duration-300"
            :class="messageText.trim()
              ? 'bg-primary text-white hover:bg-primary-400'
              : 'bg-ink-faint/30 text-ink-muted cursor-not-allowed'"
            :disabled="!messageText.trim()"
            @click="sendMessage"
          >
            发送
          </button>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center animate-fade-in">
        <div class="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <i class="carbon:chat text-3xl text-primary-300" />
        </div>
        <h3 class="text-lg font-light text-ink mb-2">选择一个对话</h3>
        <p class="text-sm text-ink-muted font-light">从左侧列表选择一个联系人开始聊天</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import type { Conversation } from '@/views/ChatPage.vue'

const props = defineProps<{
  conversation?: Conversation
}>()

const messageText = ref('')
const messagesContainer = ref<HTMLDivElement>()

const tools = [
  { icon: 'carbon:face-satisfied' },
  { icon: 'carbon:image' },
  { icon: 'carbon:document' },
  { icon: 'carbon:screenshot' },
  { icon: 'carbon:microphone' },
]

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => props.conversation?.id, () => {
  scrollToBottom()
})

const sendMessage = () => {
  if (!messageText.value.trim() || !props.conversation) return
  messageText.value = ''
  scrollToBottom()
}
</script>

<style>
.chat-textarea .el-textarea__inner {
  padding: 12px 16px !important;
  border-radius: 12px !important;
  border: 1px solid rgba(0,0,0,0.04) !important;
  background: rgba(255, 255, 255, 0.8) !important;
  font-family: 'Outfit', 'Inter', system-ui, sans-serif !important;
  font-weight: 300 !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: #1A1A2E !important;
  letter-spacing: 0.02em !important;
  box-shadow: none !important;
  transition: all 0.3s ease;
}

.chat-textarea .el-textarea__inner:focus {
  border-color: rgba(143, 168, 154, 0.5) !important;
  box-shadow: none !important;
}

.chat-textarea .el-textarea__inner::placeholder {
  color: #C8CCD0 !important;
  font-weight: 300 !important;
}
</style>
