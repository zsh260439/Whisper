<template>
  <header class="room-header">
    <div class="flex items-center gap-3">
      <UserAvatar
        :label="conversation.avatar"
        :color="conversation.avatarColor"
        :image-url="peerProfile?.avatarImageUrl"
        :size="40"
        alt="会话头像"
      />

      <div class="min-w-0">
        <h2 class="truncate text-[17px] tracking-wide text-ink">{{ headerTitle }}</h2>

        <template v-if="conversation.isGroup">
          <p class="mt-1 text-xs font-light text-ink-muted">
            群号 {{ groupIdText }}
          </p>
        </template>

        <template v-else>
          <p class="mt-1 flex items-center gap-1 text-xs font-light" :class="directConversationOnline ? 'text-[#49c893]' : 'text-ink-faint'">
            <span class="h-1.5 w-1.5 rounded-full" :class="directConversationOnline ? 'bg-[#49c893]' : 'bg-ink-faint'" />
            {{ directConversationOnline ? '在线' : '离线' }}
          </p>
        </template>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <button class="room-header__icon-btn" type="button" aria-label="语音通话">
        <i class="i-carbon-phone text-lg" />
      </button>
      <button class="room-header__icon-btn" type="button" aria-label="视频通话">
        <i class="i-carbon-video text-lg" />
      </button>
      <button class="room-header__icon-btn" type="button" aria-label="搜索消息">
        <i class="i-carbon-search text-lg" />
      </button>
      <button
        class="room-header__icon-btn"
        :class="detailsVisible ? 'room-header__icon-btn--active' : ''"
        type="button"
        :aria-label="detailsVisible ? '收起详情' : '打开详情'"
        @click="$emit('toggle-details')"
      >
        <i class="i-carbon-overflow-menu-vertical text-lg" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation, UserProfile } from '@/types/room'

const props = defineProps<{
  conversation: Conversation
  peerProfile?: UserProfile
  detailsVisible: boolean
}>()

defineEmits<{
  'toggle-details': []
}>()

const groupIdText = computed(() =>
  props.conversation.groupMeta?.groupId ?? '未生成',
)

const groupMemberCount = computed(() =>
  props.conversation.groupMeta?.memberIds.length ?? props.conversation.groupMeta?.memberCount ?? 1,
)

const directConversationOnline = computed(() =>
  props.peerProfile?.online ?? props.conversation.online,
)

const headerTitle = computed(() => {
  if (props.conversation.isGroup)
    return `${props.conversation.name} (${groupMemberCount.value})`

  return props.peerProfile?.name ?? props.conversation.name
})
</script>

<style scoped>
.room-header {
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

.room-header__icon-btn {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.room-header__icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
}

.room-header__icon-btn--active {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}
</style>
