<template>
  <div class="room-message-item" :class="message.isMine ? 'justify-end' : 'justify-start'">
    <div v-if="!message.isMine" class="mb-1 shrink-0">
      <UserAvatar
        :label="conversation.avatar"
        :color="conversation.avatarColor"
        :size="32"
        alt="消息头像"
      />
    </div>

    <div :class="message.type === 'image' ? 'max-w-[240px] sm:max-w-[300px] lg:max-w-[360px]' : 'max-w-[150px] sm:max-w-[186px] lg:max-w-[214px]'">
      <div
        class="room-message-item__bubble"
        :class="[
          message.isMine ? 'room-message-item__bubble--mine' : 'room-message-item__bubble--other',
          message.type === 'image' ? 'room-message-item__bubble--media' : '',
        ]"
      >
        <template v-if="message.type === 'image' && message.imageUrl">
          <a :href="message.imageUrl" target="_blank" rel="noreferrer" class="room-message-item__image-link">
            <img
              :src="message.imageUrl"
              :alt="message.content || '聊天图片'"
              class="room-message-item__image"
            >
          </a>
          <p v-if="mediaCaption" class="room-message-item__caption">
            {{ mediaCaption }}
          </p>
        </template>

        <p v-else class="text-[13px] leading-[1.55] whitespace-pre-wrap break-words">
          {{ message.content }}
        </p>

        <div class="mt-1 flex items-center gap-1" :class="message.isMine ? 'room-message-item__meta--mine justify-end' : 'room-message-item__meta--other justify-end'">
          <span class="text-[10px]">{{ message.time }}</span>
          <i v-if="message.isMine" class="i-carbon-checkmark text-[11px]" />
        </div>
      </div>
    </div>

    <div v-if="message.isMine" class="mb-1 shrink-0">
      <UserAvatar
        :label="currentUser.avatar"
        :color="currentUser.avatarColor"
        :image-url="currentUser.avatarImageUrl"
        :size="32"
        alt="我的头像"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation, Message, UserProfile } from '@/types/room'
import { getMediaCaption } from '@/utils/room'

const props = defineProps<{
  conversation: Conversation
  message: Message
  currentUser: UserProfile
}>()

const mediaCaption = computed(() =>
  getMediaCaption(props.message),
)
</script>

<style scoped>
.room-message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: room-message-slide-up 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.room-message-item__bubble {
  padding: 8px 10px 7px;
  border-radius: 14px;
  box-shadow: var(--surface-shadow);
  transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.room-message-item__bubble--mine {
  padding: 7px 10px 6px;
  border-top-right-radius: 5px;
  background: var(--bubble-mine-bg);
  color: var(--bubble-mine-text);
}

.room-message-item__bubble--other {
  padding: 7px 10px 6px;
  border: 1px solid var(--bubble-other-border);
  border-top-left-radius: 5px;
  background: var(--bubble-other-bg);
  color: var(--bubble-other-text);
}

.room-message-item__bubble--media {
  padding: 8px;
  overflow: hidden;
}

.room-message-item__image-link {
  display: block;
  overflow: hidden;
  border-radius: 12px;
}

.room-message-item__image {
  display: block;
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.42);
}

.room-message-item__caption {
  margin-top: 8px;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.5;
  word-break: break-word;
}

.room-message-item__meta--mine {
  color: var(--bubble-mine-meta);
}

.room-message-item__meta--other {
  color: var(--bubble-other-meta);
}

@keyframes room-message-slide-up {
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
