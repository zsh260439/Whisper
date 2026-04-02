<template>
  <aside class="detail-side">
    <div class="detail-side__panel">
      <header class="detail-side__header">
        <div>
          <p class="detail-side__eyebrow">{{ conversation.isGroup ? '群详情' : '个人信息' }}</p>
          <h3 class="detail-side__title">{{ detailTitle }}</h3>
        </div>

        <button class="detail-side__close" type="button" aria-label="关闭详情" @click="emit('close')">
          <i class="i-carbon-close-large text-[15px]" />
        </button>
      </header>

      <template v-if="conversation.isGroup">
        <div class="group-side__summary">
          <div class="group-side__summary-main">
            <div
              class="group-side__summary-avatar"
              :style="{ backgroundColor: conversation.avatarColor }"
            >
              {{ conversation.avatar }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="group-side__summary-top">
                <h3 class="truncate text-[15px] font-medium tracking-wide text-ink">{{ conversation.name }}</h3>
                <span class="group-side__summary-count">{{ groupMemberCount }}</span>
              </div>
              <p class="mt-1 truncate text-[12px] text-ink-faint">群号 {{ groupIdText }}</p>

              <div class="group-side__summary-tags">
                <span class="group-side__summary-tag">群成员 {{ groupMemberCount }}</span>
                <span class="group-side__summary-tag">全部可见</span>
              </div>
            </div>

            <button class="group-side__toggle" type="button" @click="inviteExpanded = !inviteExpanded">
              <i :class="inviteExpanded ? 'i-carbon-chevron-up' : 'i-carbon-add'" />
            </button>
          </div>

          <div class="group-side__preview">
            <div class="group-side__preview-avatars">
              <div
                v-for="member in previewMembers"
                :key="`preview-${member.id}`"
                class="group-side__preview-avatar"
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

        <label class="group-side__search">
          <i class="i-carbon-search text-sm text-ink-faint" />
          <input
            v-model="memberKeyword"
            class="group-side__search-input"
            type="text"
            placeholder="搜索群成员"
          >
        </label>

        <div v-if="inviteExpanded" class="group-side__invite-panel">
          <div class="group-side__section-head">
            <div>
              <p class="group-side__section-title">邀请成员</p>
              <p class="group-side__section-desc">选择后直接加入当前群聊</p>
            </div>
            <span class="group-side__section-meta">已选 {{ selectedInviteIds.length }}</span>
          </div>

          <div v-if="filteredInviteCandidates.length" class="group-side__invite-list">
            <button
              v-for="candidate in filteredInviteCandidates"
              :key="candidate.id"
              class="group-side__invite-item"
              :class="selectedInviteIds.includes(candidate.id) ? 'group-side__invite-item--active' : ''"
              type="button"
              @click="toggleInvite(candidate.id)"
            >
              <div class="group-side__avatar-wrap">
                <UserAvatar
                  class="group-side__avatar"
                  :label="candidate.avatar"
                  :color="candidate.avatarColor"
                  :image-url="candidate.avatarImageUrl"
                  :size="34"
                  alt="候选成员头像"
                />
                <span class="group-side__presence" :class="candidate.online ? 'group-side__presence--online' : ''" />
              </div>

              <div class="min-w-0 flex-1 text-left">
                <p class="truncate text-[13px] text-ink">{{ candidate.name }}</p>
                <p class="truncate text-[11px] text-ink-faint">@{{ candidate.account }}</p>
              </div>

              <span class="group-side__state">{{ isFriend(candidate.id) ? '好友' : '可邀' }}</span>
            </button>
          </div>

          <div v-else class="group-side__empty">
            没有可邀请的成员
          </div>

          <div v-if="selectedInviteMembers.length" class="group-side__selected">
            <span
              v-for="member in selectedInviteMembers"
              :key="`selected-${member.id}`"
              class="group-side__selected-chip"
            >
              {{ member.name }}
            </span>
          </div>

          <button
            class="group-side__invite-submit"
            :class="canInviteMembers ? 'group-side__invite-submit--active' : 'group-side__invite-submit--disabled'"
            :disabled="!canInviteMembers"
            type="button"
            @click="submitInviteMembers"
          >
            邀请加入
          </button>
        </div>

        <div class="group-side__member-header">
          <span class="group-side__section-title">群成员</span>
          <span class="group-side__section-meta">{{ filteredGroupMembers.length }} 位</span>
        </div>

        <div class="group-side__member-list">
          <div
            v-for="member in filteredGroupMembers"
            :key="member.id"
            class="group-side__member-item"
          >
            <div class="group-side__avatar-wrap">
              <UserAvatar
                class="group-side__avatar"
                :label="member.avatar"
                :color="member.avatarColor"
                :image-url="member.avatarImageUrl"
                :size="34"
                alt="成员头像"
              />
              <span class="group-side__presence" :class="member.online ? 'group-side__presence--online' : ''" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px] text-ink">{{ member.name }}</p>
              <p class="truncate text-[11px] text-ink-faint">@{{ member.account }}</p>
            </div>

            <div class="group-side__member-action">
              <span v-if="member.id === currentUserId" class="group-side__tag">我</span>
              <span v-else-if="isFriend(member.id)" class="group-side__tag group-side__tag--friend">好友</span>
              <button
                v-else
                class="group-side__friend-btn"
                type="button"
                @click="emit('addFriend', member.id)"
              >
                加好友
              </button>
            </div>
          </div>

          <div v-if="!filteredGroupMembers.length" class="group-side__empty">
            没找到相关成员
          </div>
        </div>
      </template>

      <template v-else>
        <section class="profile-side__summary">
          <UserAvatar
            class="profile-side__avatar"
            :label="directProfile?.avatar ?? conversation.avatar"
            :color="directProfile?.avatarColor ?? conversation.avatarColor"
            :image-url="directProfile?.avatarImageUrl"
            :size="58"
            shape="rounded"
            alt="个人头像"
          />

          <div class="min-w-0 w-full">
            <div class="profile-side__summary-top">
              <h4 class="truncate text-[16px] font-medium tracking-wide text-ink">{{ directProfile?.name ?? conversation.name }}</h4>
              <span class="profile-side__status" :class="directProfile?.online ? 'profile-side__status--online' : ''">
                {{ directProfile?.online ? '在线' : '离线' }}
              </span>
            </div>

            <p class="mt-2 text-[12px] text-ink-faint">账号 ID · @{{ directProfile?.account ?? 'unknown' }}</p>
            <p class="profile-side__signature-preview">{{ signatureText }}</p>
          </div>
        </section>

        <section class="profile-side__section">
          <p class="profile-side__section-title">基本信息</p>

          <div class="profile-side__info-card">
            <div class="profile-side__info-row">
              <span class="profile-side__info-key">名称</span>
              <span class="profile-side__info-value">{{ directProfile?.name ?? conversation.name }}</span>
            </div>

            <div class="profile-side__info-row">
              <span class="profile-side__info-key">账号 ID</span>
              <span class="profile-side__info-value">@{{ directProfile?.account ?? 'unknown' }}</span>
            </div>

            <div class="profile-side__info-row">
              <span class="profile-side__info-key">在线状态</span>
              <span class="profile-side__info-value">{{ directProfile?.online ? '在线' : '离线' }}</span>
            </div>
          </div>
        </section>

        <section class="profile-side__section">
          <p class="profile-side__section-title">个性签名</p>

          <div class="profile-side__signature-box">
            {{ signatureText }}
          </div>
        </section>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation, UserProfile } from '@/views/ChatPage.vue'

const props = defineProps<{
  conversation: Conversation
  currentUserId: number
  friendUserIds: number[]
  groupMembers: UserProfile[]
  groupInviteCandidates: UserProfile[]
  peerProfile?: UserProfile
}>()

const emit = defineEmits<{
  addFriend: [userId: number]
  inviteGroupMembers: [payload: { conversationId: number, memberIds: number[] }]
  close: []
}>()

const memberKeyword = ref('')
const inviteExpanded = ref(false)
const selectedInviteIds = ref<number[]>([])

const directProfile = computed(() =>
  props.conversation.isGroup ? undefined : props.peerProfile,
)

const detailTitle = computed(() =>
  props.conversation.isGroup ? props.conversation.name : directProfile.value?.name ?? props.conversation.name,
)

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
  Boolean(props.conversation.isGroup && selectedInviteIds.value.length > 0),
)

const signatureText = computed(() =>
  directProfile.value?.signature?.trim() || '这个人还没有留下签名。',
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
  if (!props.conversation.isGroup || !selectedInviteIds.value.length)
    return

  emit('inviteGroupMembers', {
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
.detail-side {
  display: flex;
  width: 312px;
  flex-shrink: 0;
  flex-direction: column;
  border-left: 1px solid var(--divider-color);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(251, 250, 248, 0.94) 100%);
}

.detail-side__panel {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: 14px 14px 12px;
}

.detail-side__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.detail-side__eyebrow {
  margin: 0;
  color: var(--text-faint);
  font-size: 11px;
  letter-spacing: 0.12em;
}

.detail-side__title {
  margin: 6px 0 0;
  color: var(--text-primary);
  font-size: 16px;
  letter-spacing: 0.04em;
}

.detail-side__close {
  display: inline-flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.detail-side__close:hover {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

.group-side__summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 240, 233, 0.94));
  box-shadow: 0 18px 36px rgba(29, 36, 33, 0.07);
}

.group-side__summary-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.group-side__summary-avatar {
  display: flex;
  height: 48px;
  width: 48px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #fff;
  font-size: 18px;
  letter-spacing: 0.06em;
  box-shadow: 0 10px 22px rgba(61, 79, 70, 0.18);
}

.group-side__summary-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-side__summary-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.1);
  color: var(--brand-bg);
  font-size: 11px;
  font-weight: 500;
}

.group-side__summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.group-side__summary-tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--text-soft);
  font-size: 11px;
}

.group-side__toggle {
  display: inline-flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--text-muted);
  transition: all 0.25s ease;
}

.group-side__toggle:hover {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

.group-side__preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-side__preview-avatars {
  display: flex;
  align-items: center;
}

.group-side__preview-avatar {
  display: flex;
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  margin-left: -6px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
  box-shadow: 0 8px 18px rgba(25, 32, 28, 0.08);
}

.group-side__preview-avatar:first-child {
  margin-left: 0;
}

.group-side__search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 0 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s ease, background-color 0.25s ease;
}

.group-side__search:focus-within {
  background: var(--input-focus-bg);
  box-shadow: 0 0 0 1px var(--input-focus-border);
}

.group-side__search-input {
  height: 36px;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
}

.group-side__search-input::placeholder {
  color: var(--text-faint);
}

.group-side__invite-panel {
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

.group-side__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.group-side__section-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.group-side__section-desc {
  margin: 4px 0 0;
  color: var(--text-faint);
  font-size: 11px;
}

.group-side__section-meta {
  color: var(--text-faint);
  font-size: 11px;
}

.group-side__invite-list {
  display: flex;
  max-height: 180px;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 2px;
}

.group-side__invite-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 50px;
  padding: 8px 10px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.84);
  transition: all 0.25s ease;
}

.group-side__invite-item--active {
  border-color: rgba(61, 79, 70, 0.16);
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}

.group-side__member-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 0 2px;
}

.group-side__member-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-height: 0;
  margin-top: 10px;
  padding: 0 2px 4px;
}

.group-side__member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 8px 10px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.group-side__member-item:hover {
  border-color: rgba(61, 79, 70, 0.1);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--conversation-active-shadow);
}

.group-side__avatar-wrap {
  position: relative;
}

.group-side__avatar {
  display: flex;
  height: 34px;
  width: 34px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  box-shadow: 0 8px 18px rgba(25, 32, 28, 0.08);
}

.group-side__presence {
  position: absolute;
  right: -1px;
  bottom: -1px;
  height: 10px;
  width: 10px;
  border: 2px solid rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  background: var(--text-faint);
}

.group-side__presence--online {
  background: var(--online-color);
}

.group-side__state {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--text-muted);
  font-size: 11px;
}

.group-side__selected {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group-side__selected-chip {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--text-primary);
  font-size: 11px;
}

.group-side__invite-submit {
  height: 34px;
  border-radius: 12px;
  font-size: 12px;
  transition: all 0.25s ease;
}

.group-side__invite-submit--disabled {
  background: var(--send-disabled-bg);
  color: var(--send-disabled-text);
  cursor: not-allowed;
}

.group-side__invite-submit--active {
  background: var(--send-enabled-bg);
  color: var(--bubble-mine-text);
  box-shadow: var(--send-enabled-shadow);
}

.group-side__invite-submit--active:hover {
  background: var(--send-enabled-hover);
}

.group-side__member-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.group-side__tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--text-muted);
  font-size: 11px;
}

.group-side__tag--friend {
  color: var(--brand-bg);
}

.group-side__friend-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--brand-bg);
  font-size: 11px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.group-side__friend-btn:hover {
  background: rgba(61, 79, 70, 0.14);
}

.group-side__empty {
  padding: 12px 10px;
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.025);
}

.profile-side__summary {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 240, 233, 0.94));
  box-shadow: 0 18px 36px rgba(29, 36, 33, 0.07);
}

.profile-side__avatar {
  display: flex;
  height: 58px;
  width: 58px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 10px 22px rgba(61, 79, 70, 0.18);
}

.profile-side__summary-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-side__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--text-muted);
  font-size: 11px;
}

.profile-side__status--online {
  color: var(--brand-bg);
}

.profile-side__signature-preview {
  margin: 10px 0 0;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.7;
}

.profile-side__section {
  margin-top: 14px;
}

.profile-side__section-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.profile-side__info-card,
.profile-side__signature-box {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 24px rgba(25, 32, 28, 0.04);
}

.profile-side__info-card {
  padding: 8px 14px;
}

.profile-side__info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
}

.profile-side__info-row + .profile-side__info-row {
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.profile-side__info-key {
  color: var(--text-muted);
  font-size: 12px;
}

.profile-side__info-value {
  color: var(--text-primary);
  font-size: 12px;
}

.profile-side__signature-box {
  padding: 14px;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.7;
}

@media (max-width: 1180px) {
  .detail-side {
    width: 288px;
  }
}
</style>
