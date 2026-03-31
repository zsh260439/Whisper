<template>
  <main class="flex min-w-0 flex-1 flex-col bg-[#fcfbf9]">
    <template v-if="conversation">
      <header class="chat-header">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full text-sm text-white"
            :style="{ backgroundColor: conversation.avatarColor }"
          >
            {{ conversation.avatar }}
          </div>

          <div>
            <h2 class="text-[17px] tracking-wide text-ink">{{ conversation.name }}</h2>
            <p class="mt-1 flex items-center gap-1 text-xs font-light" :class="conversation.online ? 'text-[#49c893]' : 'text-ink-faint'">
              <span class="h-1.5 w-1.5 rounded-full" :class="conversation.online ? 'bg-[#49c893]' : 'bg-ink-faint'" />
              {{ conversation.online ? '在线' : '离线' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button class="window-icon-btn" type="button" aria-label="语音通话">
            <i class="i-carbon-phone text-lg" />
          </button>
          <button class="window-icon-btn" type="button" aria-label="视频通话">
            <i class="i-carbon-video text-lg" />
          </button>
          <button class="window-icon-btn" type="button" aria-label="搜索消息">
            <i class="i-carbon-search text-lg" />
          </button>
          <button class="window-icon-btn" type="button" aria-label="更多操作">
            <i class="i-carbon-overflow-menu-vertical text-lg" />
          </button>
        </div>
      </header>

      <div ref="messagesContainer" class="flex-1 overflow-y-auto px-8 py-8">
        <div class="mx-auto max-w-[920px]">
          <div class="mb-8 flex items-center justify-center">
            <span class="rounded-full bg-[#f3f1ed] px-3 py-1 text-xs font-light tracking-wide text-ink-muted">
              今天
            </span>
          </div>

          <div class="space-y-5">
            <div
              v-for="(message, index) in conversation.messages"
              :key="`${conversation.id}-${message.id}`"
              class="message-item flex items-start gap-4"
              :class="message.isMine ? 'justify-end' : 'justify-start'"
              :style="{ animationDelay: getMessageAnimationDelay(index) }"
            >
              <div
                v-if="!message.isMine"
                class="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white"
                :style="{ backgroundColor: conversation.avatarColor }"
              >
                {{ conversation.avatar }}
              </div>

              <div class="max-w-[280px] sm:max-w-[320px] lg:max-w-[340px]">
                <div
                  class="message-bubble"
                  :class="message.isMine ? 'message-bubble--mine' : 'message-bubble--other'"
                >
                  <p class="text-[15px] leading-[1.75]">
                    {{ message.content }}
                  </p>

                  <div class="mt-1.5 flex items-center gap-1" :class="message.isMine ? 'justify-end text-white/45' : 'justify-end text-ink-faint'">
                    <span class="text-[11px]">{{ message.time }}</span>
                    <i v-if="message.isMine" class="i-carbon-checkmark text-[12px]" />
                  </div>
                </div>
              </div>

              <div
                v-if="message.isMine"
                class="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white"
                style="background-color: #C4A882;"
              >
                我
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-composer">
        <div class="px-8 pt-3">
          <div class="mx-auto flex max-w-[920px] items-center gap-1">
            <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="表情">
              <i class="i-carbon-face-satisfied text-lg" />
            </button>
            <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="图片">
              <i class="i-carbon-image text-lg" />
            </button>
            <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="文件">
              <i class="i-carbon-document text-lg" />
            </button>
            <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="截图">
              <i class="i-carbon-crop text-lg" />
            </button>
            <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="语音">
              <i class="i-carbon-microphone text-lg" />
            </button>
          </div>
        </div>

        <div class="px-8 pt-2">
          <div class="mx-auto max-w-[920px]">
            <el-input
              v-model="messageText"
              class="message-input"
              type="textarea"
              resize="none"
              :autosize="{ minRows: 1, maxRows: 4 }"
              placeholder="输入消息..."
              @keydown.enter.exact.prevent="sendMessage"
            />
          </div>
        </div>

        <div class="px-8 pb-4 pt-3">
          <div class="mx-auto flex max-w-[920px] items-center justify-between gap-4">
            <span class="text-xs font-light tracking-wide text-ink-faint">Enter 发送 · Shift+Enter 换行</span>

            <button
              class="send-btn"
              :class="messageText.trim()
                ? 'bg-primary text-white shadow-[0_12px_24px_rgba(61,79,70,0.16)] hover:bg-primary-400'
                : 'bg-[#f2efea] text-[#c1c6cb] cursor-not-allowed'"
              :disabled="!messageText.trim()"
              type="button"
              @click="sendMessage"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="flex flex-1 items-center justify-center">
      <div class="rounded-[28px] border border-black/5 bg-white/70 px-10 py-12 text-center shadow-[0_16px_40px_rgba(25,32,28,0.04)]">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/8 text-primary">
          <i class="i-carbon-chat text-3xl" />
        </div>
        <h3 class="text-lg text-ink">选择一个会话</h3>
        <p class="mt-2 text-sm font-light text-ink-muted">从左侧列表打开联系人，开始新的对话。</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { Conversation } from '@/views/ChatPage.vue'

const props = defineProps<{
  conversation?: Conversation
}>()

const messageText = ref('')
const messagesContainer = ref<HTMLDivElement>()

const scrollToBottom = async (behavior: ScrollBehavior = 'auto') => {
  await nextTick()

  if (!messagesContainer.value)
    return

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior,
  })
}

watch(
  () => [props.conversation?.id, props.conversation?.messages.length],
  () => {
    scrollToBottom()
  },
  { immediate: true },
)

const sendMessage = async () => {
  const content = messageText.value.trim()

  if (!content || !props.conversation)
    return

  const time = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  props.conversation.messages.push({
    id: Date.now(),
    senderId: 0,
    senderName: '我',
    content,
    time,
    isMine: true,
  })

  props.conversation.lastMessage = content
  props.conversation.lastTime = time
  props.conversation.unread = 0

  messageText.value = ''
  await scrollToBottom('smooth')
}

const getMessageAnimationDelay = (index: number) =>
  `${0.1 + Math.min(index, 6) * 0.08}s`
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(252, 251, 249, 0.82);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

.chat-composer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(252, 251, 249, 0.84);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

.window-icon-btn {
  display: inline-flex;
  height: 38px;
  width: 38px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #9aa8b5;
  transition: all 0.25s ease;
}

.window-icon-btn:hover {
  background: rgba(61, 79, 70, 0.06);
  color: #3d4f46;
}

.window-icon-btn--sm {
  height: 34px;
  width: 34px;
  border-radius: 12px;
}

.message-bubble {
  padding: 11px 14px 10px;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(25, 32, 28, 0.04);
}

.message-item {
  animation: message-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.message-bubble--mine {
  border-top-right-radius: 8px;
  background: #3d4f46;
  color: #ffffff;
}

.message-bubble--other {
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-top-left-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  color: #1a1a2e;
}

.message-input :deep(.el-textarea__inner) {
  padding: 13px 18px !important;
  border: none !important;
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04) !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  color: #1a1a2e !important;
  transition: all 0.25s ease !important;
}

.message-input :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.07) !important;
}

.message-input :deep(.el-textarea__inner:focus) {
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 0 0 1px rgba(143, 168, 154, 0.38) !important;
}

.message-input :deep(.el-textarea__inner::placeholder) {
  color: #c3c8ce !important;
  font-weight: 300 !important;
}

.send-btn {
  border: none;
  border-radius: 16px;
  padding: 10px 22px;
  font-size: 14px;
  letter-spacing: 0.08em;
  transition: all 0.25s ease;
}

@keyframes message-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
