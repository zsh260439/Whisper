<template>
  <main class="chat-window-shell flex min-w-0 flex-1">
    <template v-if="conversation">
      <section class="chat-main flex min-w-0 flex-1 flex-col">
        <header class="chat-header">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full text-sm text-white"
              :style="{ backgroundColor: conversation.avatarColor }"
            >
              {{ conversation.avatar }}
            </div>

            <div class="min-w-0">
              <h2 class="truncate text-[17px] tracking-wide text-ink">{{ headerTitle }}</h2>

              <template v-if="conversation.isGroup">
                <p class="mt-1 text-xs font-light text-ink-muted">
                  群号 {{ groupIdText }}
                </p>
              </template>

              <template v-else>
                <p class="mt-1 flex items-center gap-1 text-xs font-light" :class="conversation.online ? 'text-[#49c893]' : 'text-ink-faint'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="conversation.online ? 'bg-[#49c893]' : 'bg-ink-faint'" />
                  {{ conversation.online ? '在线' : '离线' }}
                </p>
              </template>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button class="window-icon-btn" type="button" aria-label="语音通话">
              <i class="i-carbon-phone text-lg" />
            </button>
            <button class="window-icon-btn" type="button" aria-label="视频通话">
              <i class="i-carbon-video text-lg" />
            </button>
            <button class="window-icon-btn" type="button" aria-label="搜索消息">
              <i class="i-carbon-search text-lg" />
            </button>
            <button class="window-icon-btn" type="button" aria-label="更多操作">
              <i class="i-carbon-overflow-menu-vertical text-lg" />
            </button>
          </div>
        </header>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto px-8 py-8">
          <div class="mx-auto max-w-[920px]">
            <div class="mb-8 flex items-center justify-center">
              <span class="date-pill rounded-full px-3 py-1 text-xs font-light tracking-wide">
                今天
              </span>
            </div>

            <div class="space-y-[10px]">
              <div
                v-for="message in conversation.messages"
                :key="`${conversation.id}-${message.id}`"
                class="message-item flex items-start gap-3"
                :class="message.isMine ? 'justify-end' : 'justify-start'"
              >
                <div
                  v-if="!message.isMine"
                  class="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white"
                  :style="{ backgroundColor: conversation.avatarColor }"
                >
                  {{ conversation.avatar }}
                </div>

                <div class="max-w-[150px] sm:max-w-[186px] lg:max-w-[214px]">
                  <div
                    class="message-bubble"
                    :class="message.isMine ? 'message-bubble--mine' : 'message-bubble--other'"
                  >
                    <p class="text-[13px] leading-[1.55]">
                      {{ message.content }}
                    </p>

                    <div class="message-meta mt-1 flex items-center gap-1" :class="message.isMine ? 'message-meta--mine justify-end' : 'message-meta--other justify-end'">
                      <span class="text-[10px]">{{ message.time }}</span>
                      <i v-if="message.isMine" class="i-carbon-checkmark text-[11px]" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="message.isMine"
                  class="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white"
                  style="background-color: #C4A882;"
                >
                  我
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-composer">
          <div class="px-8 pt-3">
            <div class="mx-auto flex max-w-[920px] items-center gap-1">
              <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="表情">
                <i class="i-carbon-face-satisfied text-lg" />
              </button>
              <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="图片">
                <i class="i-carbon-image text-lg" />
              </button>
              <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="文件">
                <i class="i-carbon-document text-lg" />
              </button>
              <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="截图">
                <i class="i-carbon-crop text-lg" />
              </button>
              <button class="window-icon-btn window-icon-btn--sm" type="button" aria-label="语音">
                <i class="i-carbon-microphone text-lg" />
              </button>
            </div>
          </div>

          <div class="px-8 pt-2">
            <div class="mx-auto max-w-[920px]">
              <el-input
                v-model="messageText"
                class="message-input"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 1, maxRows: 4 }"
                placeholder="输入消息..."
                @keydown.enter.exact.prevent="sendMessage"
              />
            </div>
          </div>

          <div class="px-8 pb-4 pt-3">
            <div class="mx-auto flex max-w-[920px] items-center justify-between gap-4">
              <span class="text-xs font-light tracking-wide text-ink-faint">Enter 发送 · Shift+Enter 换行</span>

              <button
                class="send-btn"
                :class="messageText.trim() ? 'send-btn--active' : 'send-btn--disabled'"
                :disabled="!messageText.trim()"
                type="button"
                @click="sendMessage"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside v-if="conversation.isGroup" class="group-side">
        <div class="group-side__panel">
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
                  :style="{ backgroundColor: member.avatarColor }"
                >
                  {{ member.avatar }}
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
                  <div class="group-side__avatar" :style="{ backgroundColor: candidate.avatarColor }">
                    {{ candidate.avatar }}
                  </div>
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
              <div class="group-side__avatar" :style="{ backgroundColor: member.avatarColor }">
                {{ member.avatar }}
              </div>
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
        </div>
      </aside>
    </template>

    <div v-else class="flex flex-1 items-center justify-center">
      <div class="rounded-[28px] border border-black/5 bg-white/70 px-10 py-12 text-center shadow-[0_16px_40px_rgba(25,32,28,0.04)]">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/8 text-primary">
          <i class="i-carbon-chat text-3xl" />
        </div>
        <h3 class="text-lg text-ink">选择一个会话</h3>
        <p class="mt-2 text-sm font-light text-ink-muted">从左侧列表打开联系人或群聊，开始新的对话。</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Conversation, UserProfile } from '@/views/ChatPage.vue'

const props = defineProps<{
  conversation?: Conversation
  currentUserId: number
  friendUserIds: number[]
  groupMembers: UserProfile[]
  groupInviteCandidates: UserProfile[]
}>()

const emit = defineEmits<{
  addFriend: [userId: number]
  inviteGroupMembers: [payload: { conversationId: number, memberIds: number[] }]
}>()

const messageText = ref('')
const memberKeyword = ref('')
const inviteExpanded = ref(false)
const selectedInviteIds = ref<number[]>([])
const messagesContainer = ref<HTMLDivElement>()

const scrollToBottom = async (behavior: ScrollBehavior = 'auto') => {
  await nextTick()

  if (!messagesContainer.value)
    return

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior,
  })
}

const groupIdText = computed(() =>
  props.conversation?.groupMeta?.groupId ?? '未生成',
)

const groupMemberCount = computed(() =>
  props.conversation?.groupMeta?.memberIds.length ?? props.conversation?.groupMeta?.memberCount ?? 1,
)

const headerTitle = computed(() => {
  if (!props.conversation)
    return ''

  if (props.conversation.isGroup)
    return `${props.conversation.name} (${groupMemberCount.value})`

  return props.conversation.name
})

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
  Boolean(props.conversation?.isGroup && selectedInviteIds.value.length > 0),
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
  if (!props.conversation?.isGroup || !selectedInviteIds.value.length)
    return

  emit('inviteGroupMembers', {
    conversationId: props.conversation.id,
    memberIds: [...selectedInviteIds.value],
  })

  selectedInviteIds.value = []
  inviteExpanded.value = false
}

watch(
  () => [props.conversation?.id, props.conversation?.messages.length],
  () => {
    scrollToBottom()
  },
  { immediate: true },
)

watch(
  () => props.conversation?.id,
  () => {
    memberKeyword.value = ''
    inviteExpanded.value = false
    selectedInviteIds.value = []
  },
)

const sendMessage = async () => {
  const content = messageText.value.trim()

  if (!content || !props.conversation)
    return

  const time = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  props.conversation.messages.push({
    id: Date.now(),
    senderId: 0,
    senderName: '我',
    content,
    time,
    isMine: true,
  })

  props.conversation.lastMessage = content
  props.conversation.lastTime = time
  props.conversation.unread = 0

  messageText.value = ''
  await scrollToBottom()
}
</script>

<style scoped>
.chat-window-shell {
  background: var(--page-bg);
  transition: background-color 0.25s ease;
}

.chat-main {
  min-width: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid var(--divider-color);
  background: var(--header-bg);
  backdrop-filter: var(--header-backdrop);
  -webkit-backdrop-filter: var(--header-backdrop);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.chat-composer {
  border-top: 1px solid var(--divider-color);
  background: var(--composer-bg);
  backdrop-filter: var(--composer-backdrop);
  -webkit-backdrop-filter: var(--composer-backdrop);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.window-icon-btn {
  display: inline-flex;
  height: 38px;
  width: 38px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.window-icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
}

.window-icon-btn--sm {
  height: 34px;
  width: 34px;
  border-radius: 12px;
}

.message-bubble {
  padding: 8px 10px 7px;
  border-radius: 14px;
  box-shadow: var(--surface-shadow);
  transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.message-item {
  animation: message-slide-up 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.message-bubble--mine {
  border-top-right-radius: 5px;
  padding: 7px 10px 6px;
  background: var(--bubble-mine-bg);
  color: var(--bubble-mine-text);
}

.message-bubble--other {
  border: 1px solid var(--bubble-other-border);
  border-top-left-radius: 5px;
  padding: 7px 10px 6px;
  background: var(--bubble-other-bg);
  color: var(--bubble-other-text);
}

.message-meta--mine {
  color: var(--bubble-mine-meta);
}

.message-meta--other {
  color: var(--bubble-other-meta);
}

.date-pill {
  background: var(--date-pill-bg);
  color: var(--date-pill-text);
  transition: background-color 0.25s ease, color 0.25s ease;
}

.message-input :deep(.el-textarea__inner) {
  padding: 13px 18px !important;
  border: none !important;
  border-radius: 20px !important;
  background: var(--input-bg) !important;
  box-shadow: 0 0 0 1px var(--input-border) !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  color: var(--text-primary) !important;
  transition: all 0.25s ease !important;
}

.message-input :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--input-hover-border) !important;
}

.message-input :deep(.el-textarea__inner:focus) {
  background: var(--input-focus-bg) !important;
  box-shadow: 0 0 0 1px var(--input-focus-border) !important;
}

.message-input :deep(.el-textarea__inner::placeholder) {
  color: var(--text-faint) !important;
  font-weight: 300 !important;
}

.send-btn {
  border: none;
  border-radius: 16px;
  padding: 10px 22px;
  font-size: 14px;
  letter-spacing: 0.08em;
  transition: all 0.25s ease;
}

.send-btn--disabled {
  background: var(--send-disabled-bg);
  color: var(--send-disabled-text);
  box-shadow: none;
  cursor: not-allowed;
}

.send-btn--active {
  background: var(--send-enabled-bg);
  color: var(--bubble-mine-text);
  box-shadow: var(--send-enabled-shadow);
}

.send-btn--active:hover {
  background: var(--send-enabled-hover);
}

.group-side {
  display: flex;
  width: 312px;
  flex-shrink: 0;
  flex-direction: column;
  border-left: 1px solid var(--divider-color);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(251, 250, 248, 0.94) 100%);
}

.group-side__panel {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: 14px 14px 12px;
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

@media (max-width: 1180px) {
  .group-side {
    width: 288px;
  }
}

@keyframes message-slide-up {
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
