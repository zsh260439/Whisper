<template>
  <el-dialog v-model="visible" width="520px" align-center class="room-dialog" title="群聊">
    <div class="room-group-dialog__mode-bar">
      <button
        class="room-group-dialog__mode-btn"
        :class="groupAction === 'create' ? 'room-group-dialog__mode-btn--active' : 'room-group-dialog__mode-btn--idle'"
        type="button"
        @click="groupAction = 'create'"
      >
        创建群聊
      </button>
      <button
        class="room-group-dialog__mode-btn"
        :class="groupAction === 'join' ? 'room-group-dialog__mode-btn--active' : 'room-group-dialog__mode-btn--idle'"
        type="button"
        @click="groupAction = 'join'"
      >
        加入群聊
      </button>
    </div>

    <template v-if="groupAction === 'create'">
      <div class="room-dialog__copy">
        <p class="room-dialog__title">创建新的群聊</p>
        <p class="room-dialog__desc">群号会在创建后由后台自动生成，这里先按本地演示逻辑模拟。</p>
      </div>

      <div class="room-dialog__section">
        <p class="room-dialog__section-title">群头像</p>

        <div class="room-group-dialog__avatar-grid">
          <button
            v-for="option in GROUP_AVATAR_OPTIONS"
            :key="`${option.label}-${option.color}`"
            class="room-group-dialog__avatar-option"
            :class="selectedAvatar.label === option.label && selectedAvatar.color === option.color ? 'room-group-dialog__avatar-option--active' : ''"
            type="button"
            @click="selectedAvatar = option"
          >
            <span class="room-group-dialog__avatar-badge" :style="{ backgroundColor: option.color }">
              {{ option.label }}
            </span>
          </button>
        </div>
      </div>

      <div class="room-dialog__section">
        <p class="room-dialog__section-title">群名称</p>
        <el-input
          v-model="groupName"
          placeholder="请输入群聊名称"
          class="room-dialog__input"
          clearable
        />
      </div>

      <div class="room-dialog__section">
        <div class="room-dialog__section-head">
          <p class="room-dialog__section-title">邀请联系人</p>
          <span class="room-dialog__section-meta">已选 {{ selectedMemberIds.length }} 人</span>
        </div>

        <div v-if="contactCandidates.length" class="room-group-dialog__member-list">
          <button
            v-for="contact in contactCandidates"
            :key="contact.id"
            class="room-group-dialog__member-item"
            :class="isSelectedMember(contact) ? 'room-group-dialog__member-item--active' : ''"
            type="button"
            @click="toggleMember(contact)"
          >
            <UserAvatar
              :label="contact.avatar"
              :color="contact.avatarColor"
              :size="34"
              alt="联系人头像"
            />

            <div class="min-w-0 flex-1 text-left">
              <p class="truncate text-[13px] text-ink">{{ contact.name }}</p>
              <p class="truncate text-[11px] text-ink-faint">{{ contact.lastMessage }}</p>
            </div>
          </button>
        </div>

        <div v-else class="room-dialog__empty">
          还没有可邀请的联系人，先去联系人里添加账号吧。
        </div>
      </div>
    </template>

    <template v-else>
      <div class="room-dialog__copy">
        <p class="room-dialog__title">输入群号加入群聊</p>
        <p class="room-dialog__desc">这里只需要输入群号，群资料会在加入后由后台返回。</p>
      </div>

      <el-input
        v-model="groupCode"
        placeholder="请输入群号"
        class="room-dialog__input"
        clearable
        @keydown.enter.prevent="submitGroupAction"
      />
    </template>

    <template #footer>
      <div class="room-dialog__footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="groupActionDisabled" @click="submitGroupAction">
          {{ groupAction === 'create' ? '创建' : '加入' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { GROUP_AVATAR_OPTIONS } from '@/constants/room'
import type { Conversation, CreateGroupPayload } from '@/types/room'

const props = defineProps<{
  modelValue: boolean
  contactCandidates: Conversation[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'create-group': [payload: CreateGroupPayload]
  'join-group': [groupCode: string]
}>()

const groupAction = ref<'create' | 'join'>('create')
const groupName = ref('')
const groupCode = ref('')
const selectedMemberIds = ref<number[]>([])
const selectedAvatar = ref(GROUP_AVATAR_OPTIONS[0])

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const groupActionDisabled = computed(() => {
  if (groupAction.value === 'create')
    return !groupName.value.trim() || selectedMemberIds.value.length === 0

  return !groupCode.value.trim()
})

const resetDialog = () => {
  groupAction.value = 'create'
  groupName.value = ''
  groupCode.value = ''
  selectedMemberIds.value = []
  selectedAvatar.value = GROUP_AVATAR_OPTIONS[0]
}

watch(
  () => props.modelValue,
  (value) => {
    if (value)
      resetDialog()
  },
)

const isSelectedMember = (conversation: Conversation) =>
  typeof conversation.peerUserId === 'number' && selectedMemberIds.value.includes(conversation.peerUserId)

const toggleMember = (conversation: Conversation) => {
  if (typeof conversation.peerUserId !== 'number')
    return

  if (selectedMemberIds.value.includes(conversation.peerUserId)) {
    selectedMemberIds.value = selectedMemberIds.value.filter(memberId => memberId !== conversation.peerUserId)
    return
  }

  selectedMemberIds.value = [...selectedMemberIds.value, conversation.peerUserId]
}

const submitGroupAction = () => {
  if (groupAction.value === 'create') {
    emit('create-group', {
      name: groupName.value.trim(),
      avatar: selectedAvatar.value.label,
      avatarColor: selectedAvatar.value.color,
      memberIds: [...selectedMemberIds.value],
    })
  }
  else {
    emit('join-group', groupCode.value.trim())
  }

  visible.value = false
}
</script>

<style scoped>
.room-group-dialog__mode-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.room-group-dialog__mode-btn {
  flex: 1;
  height: 40px;
  border-radius: 14px;
  transition: all 0.25s ease;
}

.room-group-dialog__mode-btn--active {
  background: var(--brand-bg);
  color: #fff;
  box-shadow: var(--send-enabled-shadow);
}

.room-group-dialog__mode-btn--idle {
  background: var(--conversation-hover-bg);
  color: var(--text-muted);
}

.room-group-dialog__mode-btn--idle:hover {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
}

.room-group-dialog__avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.room-group-dialog__avatar-option {
  display: flex;
  height: 58px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--divider-color);
  border-radius: 18px;
  background: var(--conversation-hover-bg);
  transition: all 0.25s ease;
}

.room-group-dialog__avatar-option--active {
  border-color: rgba(61, 79, 70, 0.22);
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}

.room-group-dialog__avatar-badge {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.05em;
}

.room-group-dialog__member-list {
  display: flex;
  max-height: 208px;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.room-group-dialog__member-item {
  display: flex;
  width: 100%;
  min-height: 52px;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid var(--divider-color);
  border-radius: 16px;
  transition: all 0.25s ease;
}

.room-group-dialog__member-item--active {
  border-color: rgba(61, 79, 70, 0.16);
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}
</style>
