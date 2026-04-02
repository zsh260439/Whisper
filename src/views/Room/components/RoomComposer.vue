<template>
  <div ref="composerRoot" class="room-composer">
    <div class="px-8 pt-3">
      <div class="relative mx-auto max-w-[920px]">
        <div class="flex items-center gap-1">
          <button class="room-composer__icon-btn room-composer__icon-btn--sm" type="button" aria-label="表情" @click="toggleEmojiPicker">
            <i class="i-carbon-face-satisfied text-lg" />
          </button>
          <button class="room-composer__icon-btn room-composer__icon-btn--sm" type="button" aria-label="图片" @click="openImagePicker">
            <i class="i-carbon-image text-lg" />
          </button>
          <button class="room-composer__icon-btn room-composer__icon-btn--sm" type="button" aria-label="截图" @click="captureScreenshot">
            <i class="i-carbon-crop text-lg" />
          </button>
        </div>

        <div v-if="emojiPickerVisible" class="room-composer__emoji-panel">
          <div class="room-composer__emoji-header">
            <button
              v-for="group in EMOJI_LIBRARY"
              :key="group.key"
              class="room-composer__emoji-group"
              :class="activeEmojiGroup === group.key ? 'room-composer__emoji-group--active' : ''"
              type="button"
              @click="activeEmojiGroup = group.key"
            >
              {{ group.label }}
            </button>
          </div>

          <div class="room-composer__emoji-grid">
            <button
              v-for="emoji in activeEmojiList"
              :key="emoji"
              class="room-composer__emoji-item"
              type="button"
              @click="handleEmojiSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-8 pt-2">
      <div class="mx-auto max-w-[920px]">
        <el-input
          v-model="messageText"
          class="room-composer__input"
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
          class="room-composer__send-btn"
          :class="messageText.trim() ? 'room-composer__send-btn--active' : 'room-composer__send-btn--disabled'"
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { onClickOutside, useFileDialog } from '@vueuse/core'
import { EMOJI_LIBRARY } from '@/constants/room'
import { readFileAsDataUrl } from '@/utils/file'
import { captureDisplayScreenshot, getScreenshotUnavailableMessage } from '@/utils/screenshot'
import type { MessageImagePayload } from '@/types/room'

const emit = defineEmits<{
  'send-text': [content: string]
  'send-image': [payload: MessageImagePayload]
}>()

const messageText = ref('')
const emojiPickerVisible = ref(false)
const activeEmojiGroup = ref(EMOJI_LIBRARY[0].key)
const composerRoot = ref<HTMLElement | null>(null)

const activeEmojiList = computed(() =>
  EMOJI_LIBRARY.find(group => group.key === activeEmojiGroup.value)?.emojis ?? EMOJI_LIBRARY[0].emojis,
)

const {
  open: openImageFileDialog,
  reset: resetImagePicker,
  onChange: onImageSelected,
} = useFileDialog({
  accept: 'image/*',
  multiple: false,
})

const openImagePicker = () => {
  openImageFileDialog()
}

onClickOutside(composerRoot, () => {
  emojiPickerVisible.value = false
})

onImageSelected(async (files) => {
  const file = files?.[0]

  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    resetImagePicker()
    return
  }

  try {
    emit('send-image', {
      imageUrl: await readFileAsDataUrl(file),
      content: file.name,
    })
  }
  catch {
    ElMessage.error('图片读取失败，请重试')
  }
  finally {
    resetImagePicker()
  }
})

const toggleEmojiPicker = () => {
  emojiPickerVisible.value = !emojiPickerVisible.value
}

const handleEmojiSelect = (emoji: string) => {
  messageText.value += emoji
  emojiPickerVisible.value = false
}

const captureScreenshot = async () => {
  emojiPickerVisible.value = false

  try {
    emit('send-image', {
      imageUrl: await captureDisplayScreenshot(),
      content: '截图',
    })
  }
  catch (error) {
    if (error instanceof Error && error.message === 'cancelled') {
      ElMessage.info('你已取消截图')
      return
    }

    if (error instanceof Error && error.message === 'unsupported') {
      ElMessage.warning(getScreenshotUnavailableMessage())
      return
    }

    ElMessage.error('截图失败，请重试')
  }
}

const sendMessage = () => {
  const content = messageText.value.trim()
  if (!content)
    return

  emit('send-text', content)
  messageText.value = ''
}
</script>

<style scoped>
.room-composer {
  border-top: 1px solid var(--divider-color);
  background: var(--composer-bg);
  backdrop-filter: var(--composer-backdrop);
  -webkit-backdrop-filter: var(--composer-backdrop);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.room-composer__icon-btn {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.room-composer__icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
}

.room-composer__icon-btn--sm {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

.room-composer__emoji-panel {
  position: absolute;
  left: 0;
  bottom: calc(100% + 12px);
  z-index: 20;
  width: min(320px, calc(100vw - 64px));
  padding: 14px;
  border: 1px solid rgba(61, 79, 70, 0.08);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 245, 240, 0.96));
  box-shadow: 0 20px 40px rgba(26, 32, 28, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.room-composer__emoji-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.room-composer__emoji-header::-webkit-scrollbar {
  display: none;
}

.room-composer__emoji-group {
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

.room-composer__emoji-group:hover {
  background: rgba(61, 79, 70, 0.1);
  color: var(--text-primary);
}

.room-composer__emoji-group--active {
  border-color: rgba(61, 79, 70, 0.12);
  background: rgba(61, 79, 70, 0.14);
  color: var(--text-primary);
  box-shadow: 0 8px 18px rgba(25, 32, 28, 0.08);
}

.room-composer__emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.room-composer__emoji-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  font-size: 22px;
  transition: transform 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.room-composer__emoji-item:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 20px rgba(25, 32, 28, 0.08);
  transform: translateY(-1px);
}

.room-composer__input :deep(.el-textarea__inner) {
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

.room-composer__input :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--input-hover-border) !important;
}

.room-composer__input :deep(.el-textarea__inner:focus) {
  background: var(--input-focus-bg) !important;
  box-shadow: 0 0 0 1px var(--input-focus-border) !important;
}

.room-composer__input :deep(.el-textarea__inner::placeholder) {
  color: var(--text-faint) !important;
  font-weight: 300 !important;
}

.room-composer__send-btn {
  padding: 10px 22px;
  border-radius: 16px;
  font-size: 14px;
  letter-spacing: 0.08em;
  transition: all 0.25s ease;
}

.room-composer__send-btn--disabled {
  background: var(--send-disabled-bg);
  color: var(--send-disabled-text);
  cursor: not-allowed;
}

.room-composer__send-btn--active {
  background: var(--send-enabled-bg);
  color: var(--bubble-mine-text);
  box-shadow: var(--send-enabled-shadow);
}

.room-composer__send-btn--active:hover {
  background: var(--send-enabled-hover);
}
</style>
