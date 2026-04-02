<template>
  <button class="room-profile-card" type="button" aria-label="编辑个人资料" @click="$emit('edit')">
    <UserAvatar
      :label="currentUser.avatar"
      :color="currentUser.avatarColor"
      :image-url="currentUser.avatarImageUrl"
      :size="40"
      alt="我的头像"
    />

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm tracking-wide text-ink">{{ currentUser.name }}</p>
      <p class="room-profile-card__meta">
        <span class="room-profile-card__status" :class="currentUser.online ? 'room-profile-card__status--online' : ''" />
        {{ currentUser.online ? '在线' : '离线' }}
        <span v-if="currentUser.signature.trim()" class="truncate">· {{ currentUser.signature }}</span>
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { UserProfile } from '@/types/room'

defineProps<{
  currentUser: UserProfile
}>()

defineEmits<{
  edit: []
}>()
</script>

<style scoped>
.room-profile-card {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-radius: 18px;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.room-profile-card:hover {
  background: var(--conversation-hover-bg);
  box-shadow: var(--conversation-active-shadow);
}

.room-profile-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 300;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.room-profile-card__status {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--text-faint);
}

.room-profile-card__status--online {
  background: var(--online-color);
}
</style>
