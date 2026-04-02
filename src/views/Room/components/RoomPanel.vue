<template>
  <main class="room-panel">
    <template v-if="conversation">
      <section class="room-panel__main">
        <RoomHeader
          :conversation="conversation"
          :peer-profile="peerProfile"
          :details-visible="detailsVisible"
          @toggle-details="detailsVisible = !detailsVisible"
        />

        <RoomMessageList
          :conversation="conversation"
          :current-user="currentUser"
        />

        <RoomComposer
          @send-text="$emit('send-text', $event)"
          @send-image="$emit('send-image', $event)"
        />
      </section>

      <transition name="room-panel-detail">
        <RoomDetailsPanel
          v-if="detailsVisible"
          :conversation="conversation"
          :current-user="currentUser"
          :peer-profile="peerProfile"
          :friend-user-ids="friendUserIds"
          :group-members="groupMembers"
          :group-invite-candidates="groupInviteCandidates"
          @close="detailsVisible = false"
          @add-friend="$emit('add-friend', $event)"
          @invite-group-members="$emit('invite-group-members', $event)"
        />
      </transition>
    </template>

    <RoomEmptyState v-else />
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RoomComposer from './RoomComposer.vue'
import RoomDetailsPanel from './RoomDetailsPanel.vue'
import RoomEmptyState from './RoomEmptyState.vue'
import RoomHeader from './RoomHeader.vue'
import RoomMessageList from './RoomMessageList.vue'
import type { Conversation, InviteGroupMembersPayload, MessageImagePayload, UserProfile } from '@/types/room'

const props = defineProps<{
  conversation?: Conversation
  currentUser: UserProfile
  peerProfile?: UserProfile
  friendUserIds: number[]
  groupMembers: UserProfile[]
  groupInviteCandidates: UserProfile[]
}>()

defineEmits<{
  'send-text': [content: string]
  'send-image': [payload: MessageImagePayload]
  'add-friend': [userId: number]
  'invite-group-members': [payload: InviteGroupMembersPayload]
}>()

const detailsVisible = ref(false)

watch(
  () => props.conversation?.id,
  () => {
    detailsVisible.value = false
  },
)
</script>

<style scoped>
.room-panel {
  display: flex;
  min-width: 0;
  flex: 1;
  background: var(--page-bg);
  transition: background-color 0.25s ease;
}

.room-panel__main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.room-panel-detail-enter-active,
.room-panel-detail-leave-active {
  transition: opacity 0.24s ease, transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.room-panel-detail-enter-from,
.room-panel-detail-leave-to {
  opacity: 0;
  transform: translateX(18px);
}
</style>
