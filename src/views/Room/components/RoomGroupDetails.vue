<template>
  <div class="room-group-details">
    <div class="room-group-details__summary">
      <div class="room-group-details__summary-main">
        <UserAvatar
          :label="conversation.avatar"
          :color="conversation.avatarColor"
          :size="48"
          shape="rounded"
          alt="群头像"
        />

        <div class="min-w-0 flex-1">
          <div class="room-group-details__summary-top">
            <h3 class="truncate text-[15px] font-medium tracking-wide text-ink">{{ conversation.name }}</h3>
            <span class="room-group-details__summary-count">{{ groupMemberCount }}</span>
          </div>
          <p class="mt-1 truncate text-[12px] text-ink-faint">群号 {{ groupIdText }}</p>

          <div class="room-group-details__summary-tags">
            <span class="room-group-details__summary-tag">群成员 {{ groupMemberCount }}</span>
            <span class="room-group-details__summary-tag">全部可见</span>
          </div>
        </div>

        <button class="room-group-details__toggle" type="button" @click="inviteExpanded = !inviteExpanded">
          <i :class="inviteExpanded ? 'i-carbon-chevron-up' : 'i-carbon-add'" />
        </button>
      </div>

      <div class="room-group-details__preview">
        <div class="room-group-details__preview-avatars">
          <div
            v-for="member in previewMembers"
            :key="`preview-${member.id}`"
            class="room-group-details__preview-avatar"
          >
            <UserAvatar
              :label="member.avatar"
              :color="member.avatarColor"
              :image-url="member.avatarImageUrl"
              :size="28"
              alt="成员头像"
            />
          </div>
        </div>
        <p class="truncate text-[11px] text-ink-faint">点击右侧成员可加好友，群成员都能邀请新人进群</p>
      </div>
    </div>

    <label class="room-group-details__search">
      <i class="i-carbon-search text-sm text-ink-faint" />
      <input
        v-model="memberKeyword"
        class="room-group-details__search-input"
        type="text"
        placeholder="搜索群成员"
      >
    </label>

    <div v-if="inviteExpanded" class="room-group-details__invite-panel">
      <div class="room-group-details__section-head">
        <div>
          <p class="room-group-details__section-title">邀请成员</p>
          <p class="room-group-details__section-desc">选择后直接加入当前群聊</p>
        </div>
        <span class="room-group-details__section-meta">已选 {{ selectedInviteIds.length }}</span>
      </div>

      <div v-if="filteredInviteCandidates.length" class="room-group-details__invite-list">
        <button
          v-for="candidate in filteredInviteCandidates"
          :key="candidate.id"
          class="room-group-details__invite-item"
          :class="selectedInviteIds.includes(candidate.id) ? 'room-group-details__invite-item--active' : ''"
          type="button"
          @click="toggleInvite(candidate.id)"
        >
          <div class="room-group-details__avatar-wrap">
            <UserAvatar
              class="room-group-details__avatar"
              :label="candidate.avatar"
              :color="candidate.avatarColor"
              :image-url="candidate.avatarImageUrl"
              :size="34"
              alt="候选成员头像"
            />
            <span class="room-group-details__presence" :class="candidate.online ? 'room-group-details__presence--online' : ''" />
          </div>

          <div class="min-w-0 flex-1 text-left">
            <p class="truncate text-[13px] text-ink">{{ candidate.name }}</p>
            <p class="truncate text-[11px] text-ink-faint">@{{ candidate.account }}</p>
          </div>

          <span class="room-group-details__state">{{ isFriend(candidate.id) ? '好友' : '可邀' }}</span>
        </button>
      </div>

      <div v-else class="room-group-details__empty">
        没有可邀请的成员
      </div>

      <div v-if="selectedInviteMembers.length" class="room-group-details__selected">
        <span
          v-for="member in selectedInviteMembers"
          :key="`selected-${member.id}`"
          class="room-group-details__selected-chip"
        >
          {{ member.name }}
        </span>
      </div>

      <button
        class="room-group-details__invite-submit"
        :class="canInviteMembers ? 'room-group-details__invite-submit--active' : 'room-group-details__invite-submit--disabled'"
        :disabled="!canInviteMembers"
        type="button"
        @click="submitInviteMembers"
      >
        邀请加入
      </button>
    </div>

    <div class="room-group-details__member-header">
      <span class="room-group-details__section-title">群成员</span>
      <span class="room-group-details__section-meta">{{ filteredGroupMembers.length }} 位</span>
    </div>

    <div class="room-group-details__member-list">
      <div
        v-for="member in filteredGroupMembers"
        :key="member.id"
        class="room-group-details__member-item"
      >
        <div class="room-group-details__avatar-wrap">
          <UserAvatar
            class="room-group-details__avatar"
            :label="member.avatar"
            :color="member.avatarColor"
            :image-url="member.avatarImageUrl"
            :size="34"
            alt="成员头像"
          />
          <span class="room-group-details__presence" :class="member.online ? 'room-group-details__presence--online' : ''" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-[13px] text-ink">{{ member.name }}</p>
          <p class="truncate text-[11px] text-ink-faint">@{{ member.account }}</p>
        </div>

        <div class="room-group-details__member-action">
          <span v-if="member.id === currentUserId" class="room-group-details__tag">我</span>
          <span v-else-if="isFriend(member.id)" class="room-group-details__tag room-group-details__tag--friend">好友</span>
          <button
            v-else
            class="room-group-details__friend-btn"
            type="button"
            @click="$emit('add-friend', member.id)"
          >
            加好友
          </button>
        </div>
      </div>

      <div v-if="!filteredGroupMembers.length" class="room-group-details__empty">
        没找到相关成员
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation, InviteGroupMembersPayload, UserProfile } from '@/types/room'

const props = defineProps<{
  conversation: Conversation
  currentUserId: number
  friendUserIds: number[]
  groupMembers: UserProfile[]
  groupInviteCandidates: UserProfile[]
}>()

const emit = defineEmits<{
  'add-friend': [userId: number]
  'invite-group-members': [payload: InviteGroupMembersPayload]
}>()

const memberKeyword = ref('')
const inviteExpanded = ref(false)
const selectedInviteIds = ref<number[]>([])

const groupIdText = computed(() =>
  props.conversation.groupMeta?.groupId ?? '未生成',
)

const groupMemberCount = computed(() =>
  props.conversation.groupMeta?.memberIds.length ?? props.conversation.groupMeta?.memberCount ?? 1,
)

const normalizedKeyword = computed(() =>
  memberKeyword.value.trim().toLowerCase(),
)

const filteredGroupMembers = computed(() => {
  if (!normalizedKeyword.value)
    return props.groupMembers

  return props.groupMembers.filter(member =>
    member.name.toLowerCase().includes(normalizedKeyword.value)
    || member.account.toLowerCase().includes(normalizedKeyword.value),
  )
})

const filteredInviteCandidates = computed(() => {
  if (!normalizedKeyword.value)
    return props.groupInviteCandidates

  return props.groupInviteCandidates.filter(member =>
    member.name.toLowerCase().includes(normalizedKeyword.value)
    || member.account.toLowerCase().includes(normalizedKeyword.value),
  )
})

const selectedInviteMembers = computed(() =>
  props.groupInviteCandidates.filter(candidate => selectedInviteIds.value.includes(candidate.id)),
)

const previewMembers = computed(() =>
  props.groupMembers.slice(0, 5),
)

const canInviteMembers = computed(() =>
  selectedInviteIds.value.length > 0,
)

const isFriend = (userId: number) =>
  props.friendUserIds.includes(userId)

const toggleInvite = (userId: number) => {
  if (selectedInviteIds.value.includes(userId)) {
    selectedInviteIds.value = selectedInviteIds.value.filter(inviteId => inviteId !== userId)
    return
  }

  selectedInviteIds.value = [...selectedInviteIds.value, userId]
}

const submitInviteMembers = () => {
  if (!selectedInviteIds.value.length)
    return

  emit('invite-group-members', {
    conversationId: props.conversation.id,
    memberIds: [...selectedInviteIds.value],
  })

  selectedInviteIds.value = []
  inviteExpanded.value = false
}

watch(
  () => props.conversation.id,
  () => {
    memberKeyword.value = ''
    inviteExpanded.value = false
    selectedInviteIds.value = []
  },
  { immediate: true },
)
</script>

<style scoped>
.room-group-details {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.room-group-details__summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 240, 233, 0.94));
  box-shadow: 0 18px 36px rgba(29, 36, 33, 0.07);
}

.room-group-details__summary-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.room-group-details__summary-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-group-details__summary-count {
  display: inline-flex;
  min-width: 28px;
  height: 22px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.1);
  color: var(--brand-bg);
  font-size: 11px;
  font-weight: 500;
}

.room-group-details__summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.room-group-details__summary-tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--text-soft);
  font-size: 11px;
}

.room-group-details__toggle {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--text-muted);
  transition: all 0.25s ease;
}

.room-group-details__toggle:hover {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

.room-group-details__preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.room-group-details__preview-avatars {
  display: flex;
  align-items: center;
}

.room-group-details__preview-avatar {
  display: flex;
  width: 28px;
  height: 28px;
  margin-left: -6px;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(25, 32, 28, 0.08);
}

.room-group-details__preview-avatar:first-child {
  margin-left: 0;
}

.room-group-details__search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 0 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.room-group-details__search:focus-within {
  background: var(--input-focus-bg);
  box-shadow: 0 0 0 1px var(--input-focus-border);
}

.room-group-details__search-input {
  width: 100%;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
}

.room-group-details__search-input::placeholder {
  color: var(--text-faint);
}

.room-group-details__invite-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(61, 79, 70, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 10px 24px rgba(25, 32, 28, 0.04);
}

.room-group-details__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.room-group-details__section-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.room-group-details__section-desc {
  margin: 4px 0 0;
  color: var(--text-faint);
  font-size: 11px;
}

.room-group-details__section-meta {
  color: var(--text-faint);
  font-size: 11px;
}

.room-group-details__invite-list {
  display: flex;
  max-height: 180px;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.room-group-details__invite-item,
.room-group-details__member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 8px 10px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.25s ease;
}

.room-group-details__invite-item--active {
  border-color: rgba(61, 79, 70, 0.16);
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}

.room-group-details__member-item:hover {
  border-color: rgba(61, 79, 70, 0.1);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--conversation-active-shadow);
}

.room-group-details__member-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 0 2px;
}

.room-group-details__member-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  margin-top: 10px;
  overflow-y: auto;
  padding: 0 2px 4px;
}

.room-group-details__avatar-wrap {
  position: relative;
}

.room-group-details__avatar {
  box-shadow: 0 8px 18px rgba(25, 32, 28, 0.08);
}

.room-group-details__presence {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  background: var(--text-faint);
}

.room-group-details__presence--online {
  background: var(--online-color);
}

.room-group-details__state,
.room-group-details__tag {
  display: inline-flex;
  min-width: 38px;
  height: 22px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--text-muted);
  font-size: 11px;
}

.room-group-details__tag--friend {
  color: var(--brand-bg);
}

.room-group-details__selected {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-group-details__selected-chip {
  display: inline-flex;
  height: 24px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--text-primary);
  font-size: 11px;
}

.room-group-details__invite-submit {
  height: 34px;
  border-radius: 12px;
  font-size: 12px;
  transition: all 0.25s ease;
}

.room-group-details__invite-submit--disabled {
  background: var(--send-disabled-bg);
  color: var(--send-disabled-text);
  cursor: not-allowed;
}

.room-group-details__invite-submit--active {
  background: var(--send-enabled-bg);
  color: var(--bubble-mine-text);
  box-shadow: var(--send-enabled-shadow);
}

.room-group-details__invite-submit--active:hover,
.room-group-details__friend-btn:hover {
  background: var(--send-enabled-hover);
}

.room-group-details__friend-btn {
  display: inline-flex;
  height: 28px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--brand-bg);
  font-size: 11px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.room-group-details__member-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.room-group-details__empty {
  padding: 12px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.025);
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}
</style>
