<template>
  <div class="room-page">
    <RoomSidebar
      :conversations="conversations"
      :current-user="currentUserProfile"
      :selected-id="selectedConversationId"
      @select="handleSelectConversation"
      @add-contact="handleAddContact"
      @create-group="handleCreateGroup"
      @join-group="handleJoinGroup"
      @update-current-user="handleUpdateCurrentUser"
    />

    <RoomPanel
      :conversation="currentConversation"
      :current-user="currentUserProfile"
      :peer-profile="peerProfile"
      :friend-user-ids="friendUserIds"
      :group-members="groupMembers"
      :group-invite-candidates="groupInviteCandidates"
      @add-friend="handleAddFriend"
      @invite-group-members="handleInviteGroupMembers"
      @send-text="sendTextMessage"
      @send-image="sendImageMessage"
    />
  </div>
</template>

<script setup lang="ts">
import RoomPanel from './components/RoomPanel.vue'
import RoomSidebar from './components/RoomSidebar.vue'
import { useRoomState } from './composables/useRoomState'

const {
  conversations,
  selectedConversationId,
  currentConversation,
  currentUserProfile,
  peerProfile,
  friendUserIds,
  groupMembers,
  groupInviteCandidates,
  handleSelectConversation,
  handleAddContact,
  handleCreateGroup,
  handleJoinGroup,
  handleAddFriend,
  handleUpdateCurrentUser,
  handleInviteGroupMembers,
  sendTextMessage,
  sendImageMessage,
} = useRoomState()
</script>

<style scoped>
.room-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--page-bg);
}
</style>
