<template>
  <div ref="widgetRoot" class="widget-root">
    <transition name="widget-panel">
      <section v-if="isOpen" class="widget-panel">
        <header class="widget-header">
          <div class="widget-header__glow" />

          <div class="widget-agent">
            <div class="widget-agent__avatar">
              <i class="i-carbon-chat-bot text-[18px]" />
              <span class="widget-agent__status" />
            </div>

            <div class="min-w-0">
              <h3 class="truncate text-sm font-medium tracking-wide text-ink">{{ modelName }}</h3>
              <p class="mt-1 text-xs font-light text-ink-muted">{{ modelDescription }}</p>
            </div>
          </div>

          <button class="widget-icon-btn" type="button" aria-label="关闭 AI 助手" @click="isOpen = false">
            <i class="i-carbon-close-large text-[16px]" />
          </button>
        </header>

        <div class="widget-model-bar">
          <span class="widget-model-pill">默认模型</span>
          <span class="text-xs font-light text-ink-muted">后续可直接接入你的免费 API</span>
        </div>

        <div ref="messagesContainer" class="widget-messages">
          <transition-group name="widget-message" tag="div" class="space-y-3">
            <div
              v-for="item in messages"
              :key="item.id"
              class="widget-message-row"
              :class="item.role === 'user' ? 'widget-message-row--user' : 'widget-message-row--assistant'"
            >
              <div v-if="item.role === 'assistant'" class="widget-mini-avatar widget-mini-avatar--assistant">
                AI
              </div>

              <div class="widget-message-bubble-wrap">
                <div
                  class="widget-message-bubble"
                  :class="item.role === 'user' ? 'widget-message-bubble--user' : 'widget-message-bubble--assistant'"
                >
                  <p>{{ item.content }}</p>
                </div>
                <span class="widget-message-time">{{ item.time }}</span>
              </div>

              <div v-if="item.role === 'user'" class="widget-mini-avatar widget-mini-avatar--user">
                我
              </div>
            </div>

            <div v-if="isTyping" key="typing" class="widget-message-row widget-message-row--assistant">
              <div class="widget-mini-avatar widget-mini-avatar--assistant">
                AI
              </div>

              <div class="widget-message-bubble-wrap">
                <div class="widget-message-bubble widget-message-bubble--assistant widget-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <div class="widget-composer">
          <form class="widget-form" @submit.prevent="sendMessage">
            <input
              v-model="messageText"
              type="text"
              class="widget-input"
              :placeholder="placeholder"
              @keydown.enter.exact.prevent="sendMessage"
            >

            <button
              class="widget-send-btn"
              :class="{ 'widget-send-btn--active': messageText.trim() }"
              :disabled="!messageText.trim()"
              type="submit"
              aria-label="发送消息"
            >
              <i class="i-carbon-send text-[16px]" />
            </button>
          </form>
        </div>
      </section>
    </transition>

    <button
      class="widget-toggle-btn"
      :class="{ 'widget-toggle-btn--active': isOpen }"
      type="button"
      aria-label="打开 AI 助手"
      @click="toggleWidget"
    >
      <span class="widget-toggle-btn__glow" />
      <i v-if="isOpen" class="i-carbon-close-large text-[20px]" />
      <span v-else class="widget-toggle-btn__label">AI</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface WidgetMessage {
  id: number
  role: 'assistant' | 'user'
  content: string
  time: string
}

const props = withDefaults(defineProps<{
  modelName?: string
  modelDescription?: string
  placeholder?: string
  mockReply?: boolean
}>(), {
  modelName: 'Whisper Free',
  modelDescription: '演示模式 · 默认模型',
  placeholder: '输入你想问的问题...',
  mockReply: true,
})

const emit = defineEmits<{
  send: [message: string]
}>()

const formatTime = () =>
  new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const createMessage = (role: WidgetMessage['role'], content: string): WidgetMessage => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  role,
  content,
  time: formatTime(),
})

const isOpen = ref(false)
const isTyping = ref(false)
const messageText = ref('')
const widgetRoot = ref<HTMLDivElement>()
const messagesContainer = ref<HTMLDivElement>()
const replyTimer = ref<number>()
const messages = ref<WidgetMessage[]>([
  createMessage('assistant', `你好，我是 ${props.modelName}。现在先用演示模式展示 UI，后续你把发送事件接到 API 就可以了。`),
])

const scrollToBottom = async () => {
  await nextTick()

  if (!messagesContainer.value)
    return

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: 'auto',
  })
}

const toggleWidget = async () => {
  isOpen.value = !isOpen.value

  if (isOpen.value)
    await scrollToBottom()
}

const closeWidget = () => {
  isOpen.value = false
}

const handleDocumentPointerDown = (event: MouseEvent) => {
  if (!isOpen.value || !widgetRoot.value)
    return

  const target = event.target as Node | null

  if (target && widgetRoot.value.contains(target))
    return

  closeWidget()
}

const handleWindowBlur = () => {
  if (isOpen.value)
    closeWidget()
}

const sendMessage = async () => {
  const content = messageText.value.trim()

  if (!content)
    return

  messages.value.push(createMessage('user', content))
  emit('send', content)
  messageText.value = ''
  await scrollToBottom()

  if (!props.mockReply)
    return

  window.clearTimeout(replyTimer.value)
  isTyping.value = true

  replyTimer.value = window.setTimeout(async () => {
    isTyping.value = false
    messages.value.push(createMessage('assistant', '消息已收到。现在这里先保留演示回复，后面把发送事件接到你的免费 API，就能返回真实内容。'))
    await scrollToBottom()
  }, 320)
}

watch(isTyping, async active => {
  if (active)
    await scrollToBottom()
})

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentPointerDown)
  window.addEventListener('blur', handleWindowBlur)
})

onBeforeUnmount(() => {
  window.clearTimeout(replyTimer.value)
  document.removeEventListener('mousedown', handleDocumentPointerDown)
  window.removeEventListener('blur', handleWindowBlur)
})
</script>

<style scoped>
.widget-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.widget-panel {
  width: min(368px, calc(100vw - 24px));
  overflow: hidden;
  border: 1px solid var(--widget-border);
  border-radius: 26px;
  background: var(--widget-panel-bg);
  box-shadow: var(--widget-panel-shadow);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
}

.widget-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  overflow: hidden;
  padding: 16px 16px 14px;
  border-bottom: 1px solid var(--widget-border);
  background: var(--widget-header-bg);
}

.widget-header__glow {
  position: absolute;
  inset: 0;
  background: var(--widget-header-glow);
  opacity: 0.9;
  pointer-events: none;
}

.widget-agent {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.widget-agent__avatar {
  position: relative;
  display: flex;
  height: 42px;
  width: 42px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  background: var(--widget-avatar-bg);
  color: var(--brand-bg);
  box-shadow: 0 10px 24px rgba(61, 79, 70, 0.12);
}

.widget-agent__status {
  position: absolute;
  right: -1px;
  bottom: -1px;
  height: 11px;
  width: 11px;
  border: 2px solid var(--widget-status-ring);
  border-radius: 999px;
  background: var(--online-color);
}

.widget-icon-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--icon-color);
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.widget-icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.widget-model-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--widget-border);
  background: var(--widget-soft-bg);
}

.widget-model-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--widget-border-strong);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.56);
  color: var(--text-primary);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.widget-messages {
  height: 328px;
  overflow-y: auto;
  padding: 16px;
  background: var(--widget-messages-bg);
}

.widget-message-row {
  display: flex;
  gap: 10px;
}

.widget-message-row--user {
  justify-content: flex-end;
}

.widget-message-row--assistant {
  justify-content: flex-start;
}

.widget-mini-avatar {
  display: flex;
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 11px;
  letter-spacing: 0.05em;
}

.widget-mini-avatar--assistant {
  background: var(--widget-avatar-bg);
  color: var(--brand-bg);
  border: 1px solid var(--widget-border);
}

.widget-mini-avatar--user {
  background: var(--brand-bg);
  color: #fff;
}

.widget-message-bubble-wrap {
  display: flex;
  max-width: 78%;
  flex-direction: column;
  gap: 6px;
}

.widget-message-row--user .widget-message-bubble-wrap {
  align-items: flex-end;
}

.widget-message-bubble {
  border-radius: 18px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.65;
  box-shadow: var(--surface-shadow);
}

.widget-message-bubble--assistant {
  border: 1px solid var(--widget-border);
  border-top-left-radius: 8px;
  background: var(--widget-assistant-bubble-bg);
  color: var(--text-primary);
}

.widget-message-bubble--user {
  border-top-right-radius: 8px;
  background: var(--widget-user-bubble-bg);
  color: var(--bubble-mine-text);
}

.widget-message-time {
  padding: 0 2px;
  color: var(--text-faint);
  font-size: 11px;
  line-height: 1;
}

.widget-typing {
  display: inline-flex;
  width: 60px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 12px 10px;
}

.widget-typing span {
  height: 6px;
  width: 6px;
  border-radius: 999px;
  background: var(--text-faint);
  animation: widget-bounce 1s ease-in-out infinite;
}

.widget-typing span:nth-child(2) {
  animation-delay: 0.12s;
}

.widget-typing span:nth-child(3) {
  animation-delay: 0.24s;
}

.widget-composer {
  border-top: 1px solid var(--widget-border);
  background: var(--widget-soft-bg);
  padding: 14px 16px 16px;
}

.widget-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.widget-input {
  width: 100%;
  min-width: 0;
  height: 42px;
  padding: 0 16px;
  border: 1px solid var(--widget-border-strong);
  border-radius: 999px;
  background: var(--widget-input-bg);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.widget-input::placeholder {
  color: var(--text-faint);
}

.widget-input:focus {
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px rgba(143, 168, 154, 0.12);
}

.widget-send-btn {
  display: inline-flex;
  height: 42px;
  width: 42px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--send-disabled-bg);
  color: var(--send-disabled-text);
  transition: transform 0.2s ease, background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.widget-send-btn--active {
  background: var(--widget-toggle-bg);
  color: #fff;
  box-shadow: var(--widget-toggle-shadow);
}

.widget-send-btn--active:hover {
  transform: translateY(-1px);
  background: var(--widget-toggle-hover);
}

.widget-toggle-btn {
  position: relative;
  display: inline-flex;
  height: 56px;
  width: 56px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--widget-toggle-bg);
  color: #fff;
  box-shadow: var(--widget-toggle-shadow);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.widget-toggle-btn:hover {
  transform: translateY(-2px) scale(1.03);
  background: var(--widget-toggle-hover);
}

.widget-toggle-btn--active {
  transform: rotate(90deg);
}

.widget-toggle-btn__glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  opacity: 0.22;
  filter: blur(18px);
}

.widget-toggle-btn__label {
  position: relative;
  z-index: 1;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.widget-panel-enter-active,
.widget-panel-leave-active {
  transition: opacity 0.24s ease, transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;
}

.widget-panel-enter-from,
.widget-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.widget-message-enter-active,
.widget-message-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.widget-message-enter-from,
.widget-message-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes widget-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }

  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .widget-root {
    right: 12px;
    bottom: 12px;
    left: 12px;
  }

  .widget-panel {
    width: 100%;
  }

  .widget-model-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
