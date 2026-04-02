<template>
  <div ref="messagesContainer" class="room-message-list">
    <div class="mx-auto max-w-[920px]">
      <div class="mb-8 flex items-center justify-center">
        <span class="room-message-list__date-pill rounded-full px-3 py-1 text-xs font-light tracking-wide">
          今天
        </span>
      </div>

      <div class="space-y-[10px]">
        <RoomMessageItem
          v-for="message in conversation.messages"
          :key="`${conversation.id}-${message.id}`"
          :conversation="conversation"
          :message="message"
          :current-user="currentUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import RoomMessageItem from './RoomMessageItem.vue'
import type { Conversation, UserProfile } from '@/types/room'

const props = defineProps<{
  conversation: Conversation
  currentUser: UserProfile
}>()

const messagesContainer = ref<HTMLDivElement | null>(null)
const { y } = useScroll(messagesContainer, { behavior: 'smooth' })

const scrollToBottom = async (behavior: ScrollBehavior = 'auto') => {
  await nextTick()

  if (!messagesContainer.value)
    return

  if (behavior === 'smooth')
    y.value = messagesContainer.value.scrollHeight
  else
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
}

watch(
  () => [props.conversation.id, props.conversation.messages.length],
  () => scrollToBottom('smooth'),
  { immediate: true },
)
</script>

<style scoped>
.room-message-list {
  flex: 1;
  overflow-y: auto;
  padding: 32px 32px 24px;
}

.room-message-list__date-pill {
  background: var(--date-pill-bg);
  color: var(--date-pill-text);
  transition: background-color 0.25s ease, color 0.25s ease;
}
</style>
