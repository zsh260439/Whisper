<template>
  <aside class="room-details-panel">
    <div class="room-details-panel__content">
      <header class="room-details-panel__header">
        <div>
          <p class="room-details-panel__eyebrow">{{ conversation.isGroup ? '群详情' : '个人信息' }}</p>
          <h3 class="room-details-panel__title">{{ detailTitle }}</h3>
        </div>

        <button class="room-details-panel__close" type="button" aria-label="关闭详情" @click="$emit('close')">
          <i class="i-carbon-close-large text-[15px]" />
        </button>
      </header>

      <RoomGroupDetails
        v-if="conversation.isGroup"
        :conversation="conversation"
        :current-user-id="currentUser.id"
        :friend-user-ids="friendUserIds"
        :group-members="groupMembers"
        :group-invite-candidates="groupInviteCandidates"
        @add-friend="$emit('add-friend', $event)"
        @invite-group-members="$emit('invite-group-members', $event)"
      />

      <RoomDirectDetails
        v-else
        :conversation="conversation"
        :peer-profile="peerProfile"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RoomDirectDetails from './RoomDirectDetails.vue'
import RoomGroupDetails from './RoomGroupDetails.vue'
import type { Conversation, InviteGroupMembersPayload, UserProfile } from '@/types/room'

const props = defineProps<{
  conversation: Conversation
  currentUser: UserProfile
  peerProfile?: UserProfile
  friendUserIds: number[]
  groupMembers: UserProfile[]
  groupInviteCandidates: UserProfile[]
}>()

defineEmits<{
  close: []
  'add-friend': [userId: number]
  'invite-group-members': [payload: InviteGroupMembersPayload]
}>()

const detailTitle = computed(() =>
  props.conversation.isGroup ? props.conversation.name : props.peerProfile?.name ?? props.conversation.name,
)
</script>

<style scoped>
.room-details-panel {
  display: flex;
  width: 312px;
  flex-shrink: 0;
  flex-direction: column;
  border-left: 1px solid var(--divider-color);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(251, 250, 248, 0.94) 100%);
}

.room-details-panel__content {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: 14px 14px 12px;
}

.room-details-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.room-details-panel__eyebrow {
  margin: 0;
  color: var(--text-faint);
  font-size: 11px;
  letter-spacing: 0.12em;
}

.room-details-panel__title {
  margin: 6px 0 0;
  color: var(--text-primary);
  font-size: 16px;
  letter-spacing: 0.04em;
}

.room-details-panel__close {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.room-details-panel__close:hover {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

@media (max-width: 1180px) {
  .room-details-panel {
    width: 288px;
  }
}
</style>
