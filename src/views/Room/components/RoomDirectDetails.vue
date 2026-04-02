<template>
  <div>
    <section class="room-direct-details__summary">
      <UserAvatar
        class="room-direct-details__avatar"
        :label="peerProfile?.avatar ?? conversation.avatar"
        :color="peerProfile?.avatarColor ?? conversation.avatarColor"
        :image-url="peerProfile?.avatarImageUrl"
        :size="58"
        shape="rounded"
        alt="个人头像"
      />

      <div class="min-w-0 w-full">
        <div class="room-direct-details__summary-top">
          <h4 class="truncate text-[16px] font-medium tracking-wide text-ink">{{ peerProfile?.name ?? conversation.name }}</h4>
          <span class="room-direct-details__status" :class="peerProfile?.online ? 'room-direct-details__status--online' : ''">
            {{ peerProfile?.online ? '在线' : '离线' }}
          </span>
        </div>

        <p class="mt-2 text-[12px] text-ink-faint">账号 ID · @{{ peerProfile?.account ?? 'unknown' }}</p>
        <p class="room-direct-details__signature-preview">{{ signatureText }}</p>
      </div>
    </section>

    <section class="room-direct-details__section">
      <p class="room-direct-details__section-title">基本信息</p>

      <div class="room-direct-details__card">
        <div class="room-direct-details__row">
          <span class="room-direct-details__key">名称</span>
          <span class="room-direct-details__value">{{ peerProfile?.name ?? conversation.name }}</span>
        </div>
        <div class="room-direct-details__row">
          <span class="room-direct-details__key">账号 ID</span>
          <span class="room-direct-details__value">@{{ peerProfile?.account ?? 'unknown' }}</span>
        </div>
        <div class="room-direct-details__row">
          <span class="room-direct-details__key">在线状态</span>
          <span class="room-direct-details__value">{{ peerProfile?.online ? '在线' : '离线' }}</span>
        </div>
      </div>
    </section>

    <section class="room-direct-details__section">
      <p class="room-direct-details__section-title">个性签名</p>
      <div class="room-direct-details__card room-direct-details__card--signature">
        {{ signatureText }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Conversation, UserProfile } from '@/types/room'

const props = defineProps<{
  conversation: Conversation
  peerProfile?: UserProfile
}>()

const signatureText = computed(() =>
  props.peerProfile?.signature?.trim() || '这个人还没有留下签名。',
)
</script>

<style scoped>
.room-direct-details__summary {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 240, 233, 0.94));
  box-shadow: 0 18px 36px rgba(29, 36, 33, 0.07);
}

.room-direct-details__avatar {
  box-shadow: 0 10px 22px rgba(61, 79, 70, 0.18);
}

.room-direct-details__summary-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-direct-details__status {
  display: inline-flex;
  min-width: 42px;
  height: 22px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--text-muted);
  font-size: 11px;
}

.room-direct-details__status--online {
  color: var(--brand-bg);
}

.room-direct-details__signature-preview {
  margin: 10px 0 0;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.7;
}

.room-direct-details__section {
  margin-top: 14px;
}

.room-direct-details__section-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.room-direct-details__card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 24px rgba(25, 32, 28, 0.04);
}

.room-direct-details__card--signature {
  padding: 14px;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.7;
}

.room-direct-details__row {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
}

.room-direct-details__row + .room-direct-details__row {
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.room-direct-details__key {
  color: var(--text-muted);
  font-size: 12px;
}

.room-direct-details__value {
  color: var(--text-primary);
  font-size: 12px;
}
</style>
