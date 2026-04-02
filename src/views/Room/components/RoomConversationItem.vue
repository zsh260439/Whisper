<template>
  <button
    class="room-conversation-item"
    :class="selected ? 'room-conversation-item--active' : 'room-conversation-item--idle'"
    type="button"
    @click="$emit('select', conversation.id)"
  >
    <div class="relative shrink-0">
      <UserAvatar
        :label="conversation.avatar"
        :color="conversation.avatarColor"
        :size="44"
        alt="会话头像"
      />
      <span v-if="conversation.online" class="room-conversation-item__online-dot" />
    </div>

    <div class="min-w-0 flex-1">
      <div class="mb-1 flex items-start justify-between gap-2">
        <span class="truncate text-[15px] tracking-wide text-ink">{{ conversation.name }}</span>
        <span class="shrink-0 text-[11px]" :class="conversation.unread > 0 ? 'text-primary' : 'text-ink-faint'">
          {{ conversation.lastTime }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-2">
        <p class="truncate text-xs font-light leading-relaxed text-ink-muted">
          {{ conversation.lastMessage }}
        </p>
        <span v-if="conversation.unread > 0" class="room-conversation-item__badge bg-primary">
          {{ conversation.unread }}
        </span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation } from '@/types/room'

defineProps<{
  conversation: Conversation
  selected: boolean
}>()

defineEmits<{
  select: [id: number]
}>()
</script>

<style scoped>
.room-conversation-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 20px;
  text-align: left;
  transition: all 0.3s ease;
}

.room-conversation-item--active {
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}

.room-conversation-item--idle:hover {
  background: var(--conversation-hover-bg);
}

.room-conversation-item__online-dot {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 14px;
  height: 14px;
  border: 2px solid var(--online-ring);
  border-radius: 999px;
  background: var(--online-color);
}

.room-conversation-item__badge {
  display: inline-flex;
  min-width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-radius: 999px;
  color: #fff;
  font-size: 10px;
}
</style>
