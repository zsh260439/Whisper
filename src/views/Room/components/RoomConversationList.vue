<template>
  <div class="room-conversation-list">
    <template v-if="conversations.length">
      <RoomConversationItem
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
        :selected="conversation.id === selectedId"
        @select="$emit('select', $event)"
      />
    </template>

    <div v-else class="room-conversation-list__empty">
      <div>
        <p class="text-sm text-ink-soft">当前分类暂无内容</p>
        <p class="mt-1 text-xs font-light text-ink-faint">{{ emptyHint }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoomConversationItem from './RoomConversationItem.vue'
import type { Conversation } from '@/types/room'

defineProps<{
  conversations: Conversation[]
  selectedId: number
  emptyHint: string
}>()

defineEmits<{
  select: [id: number]
}>()
</script>

<style scoped>
.room-conversation-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.room-conversation-list__empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  text-align: center;
}
</style>
