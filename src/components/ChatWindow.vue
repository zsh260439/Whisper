<template>
  <main class="chat-window-shell flex min-w-0 flex-1">
    <template v-if="conversation">
      <section class="chat-main flex min-w-0 flex-1 flex-col">
        <header class="chat-header">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full text-sm text-white"
              :style="{ backgroundColor: conversation.avatarColor }"
            >
              {{ conversation.avatar }}
            </div>

            <div class="min-w-0">
              <h2 class="truncate text-[17px] tracking-wide text-ink">{{ headerTitle }}</h2>

              <template v-if="conversation.isGroup">
                <p class="mt-1 text-xs font-light text-ink-muted">
                  群号 {{ groupIdText }}
                </p>
              </template>

              <template v-else>
                <p class="mt-1 flex items-center gap-1 text-xs font-light" :class="directConversationOnline ? 'text-[#49c893]' : 'text-ink-faint'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="directConversationOnline ? 'bg-[#49c893]' : 'bg-ink-faint'" />
                  {{ directConversationOnline ? '在线' : '离线' }}
                </p>
              </template>
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
            <button
              class="window-icon-btn"
              :class="detailsVisible ? 'window-icon-btn--active' : ''"
              type="button"
              :aria-label="detailsVisible ? '收起详情' : '打开详情'"
              @click="toggleDetailsPanel"
            >
              <i class="i-carbon-overflow-menu-vertical text-lg" />
            </button>
          </div>
        </header>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto px-8 py-8">
          <div class="mx-auto max-w-[920px]">
            <div class="mb-8 flex items-center justify-center">
              <span class="date-pill rounded-full px-3 py-1 text-xs font-light tracking-wide">
                今天
              </span>
            </div>

            <div class="space-y-[10px]">
              <div
                v-for="message in conversation.messages"
                :key="`${conversation.id}-${message.id}`"
                class="message-item flex items-start gap-3"
                :class="message.isMine ? 'justify-end' : 'justify-start'"
              >
                <div
                  v-if="!message.isMine"
                  class="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white"
                  :style="{ backgroundColor: conversation.avatarColor }"
                >
                  {{ conversation.avatar }}
                </div>

                <div :class="message.type === 'image' ? 'max-w-[240px] sm:max-w-[300px] lg:max-w-[360px]' : 'max-w-[150px] sm:max-w-[186px] lg:max-w-[214px]'">
                  <div
                    class="message-bubble"
                    :class="[
                      message.isMine ? 'message-bubble--mine' : 'message-bubble--other',
                      message.type === 'image' ? 'message-bubble--media' : '',
                    ]"
                  >
                    <template v-if="message.type === 'image' && message.imageUrl">
                      <a :href="message.imageUrl" target="_blank" rel="noreferrer" class="message-image-link">
                        <img
                          :src="message.imageUrl"
                          :alt="message.content || '聊天图片'"
                          class="message-image"
                        >
                      </a>
                      <p v-if="getMediaCaption(message)" class="message-caption">
                        {{ getMediaCaption(message) }}
                      </p>
                    </template>

                    <p v-else class="text-[13px] leading-[1.55] whitespace-pre-wrap break-words">
                      {{ message.content }}
                    </p>

                    <div class="message-meta mt-1 flex items-center gap-1" :class="message.isMine ? 'message-meta--mine justify-end' : 'message-meta--other justify-end'">
                      <span class="text-[10px]">{{ message.time }}</span>
                      <i v-if="message.isMine" class="i-carbon-checkmark text-[11px]" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="message.isMine"
                  class="mb-1 shrink-0"
                >
                  <UserAvatar
                    :label="currentUserProfile.avatar"
                    :color="currentUserProfile.avatarColor"
                    :image-url="currentUserProfile.avatarImageUrl"
                    :size="32"
                    alt="我的头像"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-composer">
          <div class="px-8 pt-3">
            <div ref="composerToolsRef" class="relative mx-auto max-w-[920px]">
              <div class="flex items-center gap-1">
                <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="表情" @click="toggleEmojiPicker">
                  <i class="i-carbon-face-satisfied text-lg" />
                </button>
                <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="图片" @click="openImagePicker">
                  <i class="i-carbon-image text-lg" />
                </button>
                <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="截图" @click="captureScreenshot">
                  <i class="i-carbon-crop text-lg" />
                </button>
              </div>

              <div v-if="emojiPickerVisible" class="emoji-panel">
                <div class="emoji-panel__header">
                  <button
                    v-for="group in emojiLibrary"
                    :key="group.key"
                    class="emoji-panel__group"
                    :class="activeEmojiGroup === group.key ? 'emoji-panel__group--active' : ''"
                    type="button"
                    @click="activeEmojiGroup = group.key"
                  >
                    {{ group.label }}
                  </button>
                </div>

                <div class="emoji-panel__grid">
                  <button
                    v-for="emoji in activeEmojiList"
                    :key="emoji"
                    class="emoji-panel__item"
                    type="button"
                    @click="handleEmojiSelect(emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>

              <input
                ref="imageInputRef"
                class="hidden"
                type="file"
                accept="image/*"
                @change="handleImageInputChange"
              >
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
                :class="messageText.trim() ? 'send-btn--active' : 'send-btn--disabled'"
                :disabled="!messageText.trim()"
                type="button"
                @click="sendMessage"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </section>

      <transition name="detail-panel">
        <ConversationDetailsPanel
          v-if="detailsVisible"
          :conversation="conversation"
          :current-user-id="currentUserId"
          :friend-user-ids="friendUserIds"
          :group-members="groupMembers"
          :group-invite-candidates="groupInviteCandidates"
          :peer-profile="peerProfile"
          @add-friend="emit('addFriend', $event)"
          @invite-group-members="emit('inviteGroupMembers', $event)"
          @close="detailsVisible = false"
        />
      </transition>
    </template>

    <div v-else class="flex flex-1 items-center justify-center">
      <div class="rounded-[28px] border border-black/5 bg-white/70 px-10 py-12 text-center shadow-[0_16px_40px_rgba(25,32,28,0.04)]">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/8 text-primary">
          <i class="i-carbon-chat text-3xl" />
        </div>
        <h3 class="text-lg text-ink">选择一个会话</h3>
        <p class="mt-2 text-sm font-light text-ink-muted">从左侧列表打开联系人或群聊，开始新的对话。</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ConversationDetailsPanel from '@/components/ConversationDetailsPanel.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation, Message, UserProfile } from '@/views/ChatPage.vue'

const props = defineProps<{
  conversation?: Conversation
  currentUserId: number
  currentUserProfile: UserProfile
  peerProfile?: UserProfile
  friendUserIds: number[]
  groupMembers: UserProfile[]
  groupInviteCandidates: UserProfile[]
}>()

const emit = defineEmits<{
  addFriend: [userId: number]
  inviteGroupMembers: [payload: { conversationId: number, memberIds: number[] }]
}>()

interface EmojiGroup {
  key: string
  label: string
  emojis: string[]
}

const emojiLibrary: EmojiGroup[] = [
  { key: 'smile', label: '笑脸', emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '🥰', '😎', '🥳', '🤩', '😇', '🙂'] },
  { key: 'mood', label: '氛围', emojis: ['😌', '😴', '🤔', '🥺', '😭', '😤', '😮', '😳', '🙃', '🤗', '😏', '😶‍🌫️'] },
  { key: 'hand', label: '手势', emojis: ['👍', '👎', '👏', '🙌', '🤝', '🙏', '✌️', '🤟', '👌', '👀', '💪', '✍️'] },
  { key: 'fun', label: '趣味', emojis: ['🎉', '🎈', '🔥', '✨', '🌈', '☕', '🍉', '🌙', '🌻', '💯', '❤️', '🎵'] },
]

const messageText = ref('')
const detailsVisible = ref(false)
const emojiPickerVisible = ref(false)
const activeEmojiGroup = ref(emojiLibrary[0].key)
const messagesContainer = ref<HTMLDivElement>()
const composerToolsRef = ref<HTMLDivElement>()
const imageInputRef = ref<HTMLInputElement>()

const activeEmojiList = computed(() =>
  emojiLibrary.find(group => group.key === activeEmojiGroup.value)?.emojis ?? emojiLibrary[0].emojis,
)

const groupIdText = computed(() =>
  props.conversation?.groupMeta?.groupId ?? '未生成',
)

const groupMemberCount = computed(() =>
  props.conversation?.groupMeta?.memberIds.length ?? props.conversation?.groupMeta?.memberCount ?? 1,
)

const directConversationOnline = computed(() =>
  props.peerProfile?.online ?? props.conversation?.online ?? false,
)

const headerTitle = computed(() => {
  if (!props.conversation)
    return ''

  if (props.conversation.isGroup)
    return `${props.conversation.name} (${groupMemberCount.value})`

  return props.peerProfile?.name ?? props.conversation.name
})

const scrollToBottom = async (behavior: ScrollBehavior = 'auto') => {
  await nextTick()

  if (!messagesContainer.value)
    return

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior,
  })
}

const formatTime = () =>
  new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const getConversationPreview = (message: Message) => {
  if (message.type === 'image')
    return message.content === '截图' ? '[截图]' : '[图片]'

  return message.content
}

const appendOutgoingMessage = async (message: Message) => {
  if (!props.conversation)
    return

  props.conversation.messages.push(message)
  props.conversation.lastMessage = getConversationPreview(message)
  props.conversation.lastTime = message.time
  props.conversation.unread = 0

  await scrollToBottom('smooth')
}

const sendTextPayload = async (content: string) => {
  const trimmed = content.trim()

  if (!trimmed || !props.conversation)
    return

  await appendOutgoingMessage({
    id: Date.now() + Math.floor(Math.random() * 1000),
    senderId: props.currentUserId,
    senderName: props.currentUserProfile.name,
    content: trimmed,
    time: formatTime(),
    isMine: true,
    type: 'text',
  })
}

const getMediaCaption = (message: Message) => {
  if (message.type !== 'image')
    return ''

  return message.content === '截图' ? '' : message.content
}

const toggleDetailsPanel = () => {
  if (!props.conversation)
    return

  detailsVisible.value = !detailsVisible.value
}

const toggleEmojiPicker = () => {
  emojiPickerVisible.value = !emojiPickerVisible.value
}

const handleEmojiSelect = async (emoji: string) => {
  messageText.value += emoji
  emojiPickerVisible.value = false
}

const openImagePicker = () => {
  emojiPickerVisible.value = false
  imageInputRef.value?.click()
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const sendImageMessage = async (options: { imageUrl: string, content: string }) => {
  if (!props.conversation)
    return

  await appendOutgoingMessage({
    id: Date.now() + Math.floor(Math.random() * 1000),
    senderId: props.currentUserId,
    senderName: props.currentUserProfile.name,
    content: options.content,
    time: formatTime(),
    isMine: true,
    type: 'image',
    imageUrl: options.imageUrl,
  })
}

const handleImageInputChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    input.value = ''
    return
  }

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    input.value = ''
    return
  }

  try {
    const imageUrl = await readFileAsDataUrl(file)
    await sendImageMessage({
      imageUrl,
      content: file.name,
    })
  }
  catch {
    ElMessage.error('图片读取失败，请重试')
  }
  finally {
    input.value = ''
  }
}

const getScreenshotUnavailableMessage = () => {
  if (!window.isSecureContext)
    return '当前页面不是安全上下文，浏览器不会开放系统截图。请用 Chrome 或 Edge 打开本地地址。'

  return '当前运行环境没有开放系统截图能力，请在 Chrome 或 Edge 浏览器窗口中使用，或先截图后通过图片发送。'
}

const captureScreenshot = async () => {
  emojiPickerVisible.value = false

  if (!navigator.mediaDevices?.getDisplayMedia) {
    ElMessage.warning(getScreenshotUnavailableMessage())
    return
  }

  let stream: MediaStream | undefined

  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    })

    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    video.playsInline = true

    await video.play()
    await new Promise(resolve => setTimeout(resolve, 180))

    const sourceWidth = video.videoWidth || 1920
    const sourceHeight = video.videoHeight || 1080
    const maxWidth = 1440
    const scale = Math.min(1, maxWidth / sourceWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sourceWidth * scale))
    canvas.height = Math.max(1, Math.round(sourceHeight * scale))

    const context = canvas.getContext('2d')
    if (!context)
      throw new Error('no-canvas-context')

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    await sendImageMessage({
      imageUrl: canvas.toDataURL('image/jpeg', 0.92),
      content: '截图',
    })
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError')
      ElMessage.info('你已取消截图')
    else if (error instanceof DOMException && error.name === 'SecurityError')
      ElMessage.warning(getScreenshotUnavailableMessage())
    else
      ElMessage.error('截图失败，请重试')
  }
  finally {
    stream?.getTracks().forEach(track => track.stop())
  }
}

const handleDocumentPointerDown = (event: MouseEvent) => {
  if (!emojiPickerVisible.value || !composerToolsRef.value)
    return

  const target = event.target as Node | null
  if (target && composerToolsRef.value.contains(target))
    return

  emojiPickerVisible.value = false
}

watch(
  () => [props.conversation?.id, props.conversation?.messages.length],
  () => {
    scrollToBottom()
  },
  { immediate: true },
)

watch(
  () => props.conversation?.id,
  () => {
    detailsVisible.value = false
    emojiPickerVisible.value = false
  },
)

const sendMessage = async () => {
  const content = messageText.value.trim()
  if (!content)
    return

  await sendTextPayload(content)
  messageText.value = ''
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentPointerDown)
})
</script>

<style scoped>
.chat-window-shell {
  background: var(--page-bg);
  transition: background-color 0.25s ease;
}

.chat-main {
  min-width: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid var(--divider-color);
  background: var(--header-bg);
  backdrop-filter: var(--header-backdrop);
  -webkit-backdrop-filter: var(--header-backdrop);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.chat-composer {
  border-top: 1px solid var(--divider-color);
  background: var(--composer-bg);
  backdrop-filter: var(--composer-backdrop);
  -webkit-backdrop-filter: var(--composer-backdrop);
  transition: background-color 0.25s ease, border-color 0.25s ease;
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
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.window-icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
}

.window-icon-btn--active {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

.window-icon-btn--sm {
  height: 34px;
  width: 34px;
  border-radius: 12px;
}

.message-bubble {
  padding: 8px 10px 7px;
  border-radius: 14px;
  box-shadow: var(--surface-shadow);
  transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.message-item {
  animation: message-slide-up 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.message-bubble--mine {
  border-top-right-radius: 5px;
  padding: 7px 10px 6px;
  background: var(--bubble-mine-bg);
  color: var(--bubble-mine-text);
}

.message-bubble--other {
  border: 1px solid var(--bubble-other-border);
  border-top-left-radius: 5px;
  padding: 7px 10px 6px;
  background: var(--bubble-other-bg);
  color: var(--bubble-other-text);
}

.message-bubble--media {
  padding: 8px;
  overflow: hidden;
}

.message-image-link {
  display: block;
  border-radius: 12px;
  overflow: hidden;
}

.message-image {
  display: block;
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.42);
}

.message-caption {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-soft);
  word-break: break-word;
}

.message-meta--mine {
  color: var(--bubble-mine-meta);
}

.message-meta--other {
  color: var(--bubble-other-meta);
}

.date-pill {
  background: var(--date-pill-bg);
  color: var(--date-pill-text);
  transition: background-color 0.25s ease, color 0.25s ease;
}

.emoji-panel {
  position: absolute;
  left: 0;
  bottom: calc(100% + 12px);
  z-index: 20;
  width: min(320px, calc(100vw - 64px));
  padding: 14px;
  border: 1px solid rgba(61, 79, 70, 0.08);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 245, 240, 0.96));
  box-shadow: 0 20px 40px rgba(26, 32, 28, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.emoji-panel__header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.emoji-panel__header::-webkit-scrollbar {
  display: none;
}

.emoji-panel__group {
  flex: 0 0 auto;
  height: 30px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.06);
  color: var(--text-muted);
  font-size: 12px;
  transition: all 0.22s ease;
}

.emoji-panel__group:hover {
  background: rgba(61, 79, 70, 0.1);
  color: var(--text-primary);
}

.emoji-panel__group--active {
  border-color: rgba(61, 79, 70, 0.12);
  background: rgba(61, 79, 70, 0.14);
  color: var(--text-primary);
  box-shadow: 0 8px 18px rgba(25, 32, 28, 0.08);
}

.emoji-panel__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.emoji-panel__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  font-size: 22px;
  transition: transform 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.emoji-panel__item:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 20px rgba(25, 32, 28, 0.08);
  transform: translateY(-1px);
}

.message-input :deep(.el-textarea__inner) {
  padding: 13px 18px !important;
  border: none !important;
  border-radius: 20px !important;
  background: var(--input-bg) !important;
  box-shadow: 0 0 0 1px var(--input-border) !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  color: var(--text-primary) !important;
  transition: all 0.25s ease !important;
}

.message-input :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--input-hover-border) !important;
}

.message-input :deep(.el-textarea__inner:focus) {
  background: var(--input-focus-bg) !important;
  box-shadow: 0 0 0 1px var(--input-focus-border) !important;
}

.message-input :deep(.el-textarea__inner::placeholder) {
  color: var(--text-faint) !important;
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

.send-btn--disabled {
  background: var(--send-disabled-bg);
  color: var(--send-disabled-text);
  box-shadow: none;
  cursor: not-allowed;
}

.send-btn--active {
  background: var(--send-enabled-bg);
  color: var(--bubble-mine-text);
  box-shadow: var(--send-enabled-shadow);
}

.send-btn--active:hover {
  background: var(--send-enabled-hover);
}

.detail-panel-enter-active,
.detail-panel-leave-active {
  transition: opacity 0.24s ease, transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.detail-panel-enter-from,
.detail-panel-leave-to {
  opacity: 0;
  transform: translateX(18px);
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
