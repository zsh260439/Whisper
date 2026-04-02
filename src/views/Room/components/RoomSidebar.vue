<template>
  <aside class="room-sidebar">
    <div class="room-sidebar__nav border-r px-3 py-4">
      <div class="mb-4 flex justify-center">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm text-white shadow-[0_10px_24px_rgba(61,79,70,0.12)]">
          W
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-2">
        <button
          v-for="tab in SIDEBAR_TABS"
          :key="tab.key"
          class="room-sidebar__nav-item"
          :class="activeTab === tab.key ? 'room-sidebar__nav-item--active' : 'room-sidebar__nav-item--idle'"
          type="button"
          @click="activeTab = tab.key"
        >
          <span class="room-sidebar__nav-label">{{ tab.label }}</span>
        </button>
      </div>

      <button class="room-sidebar__icon-btn mt-4 self-center" type="button" aria-label="切换主题" @click="toggleTheme">
        <i :class="isDark ? 'i-carbon-sun text-base' : 'i-carbon-moon text-base'" />
      </button>
    </div>

    <div class="min-w-0 flex flex-1 flex-col">
      <div class="room-sidebar__top border-b px-4 pt-5 pb-4">
        <div class="mb-4 flex items-center gap-3">
          <div>
            <h1 class="text-[18px] leading-none tracking-wide text-ink">{{ activeTabMeta.label }}</h1>
            <p class="mt-1 text-xs font-light tracking-[0.18em] text-ink-muted">Whisper</p>
          </div>

          <div class="ml-auto flex items-center gap-1">
            <button
              v-if="showCreateButton"
              class="room-sidebar__icon-btn"
              type="button"
              :aria-label="createButtonLabel"
              @click="openCreateDialog"
            >
              <i class="i-carbon-add text-lg" />
            </button>
            <button class="room-sidebar__icon-btn" type="button" aria-label="设置">
              <i class="i-carbon-settings text-lg" />
            </button>
          </div>
        </div>

        <el-input
          v-model="searchQuery"
          class="room-sidebar__search"
          :placeholder="searchPlaceholder"
          clearable
          :prefix-icon="Search"
        />
      </div>

      <div class="flex-1 overflow-y-auto px-3 py-3">
        <RoomConversationList
          :conversations="filteredConversations"
          :selected-id="selectedId"
          :empty-hint="emptyHint"
          @select="$emit('select', $event)"
        />
      </div>

      <div class="room-sidebar__footer border-t px-4 py-4">
        <RoomProfileCard :current-user="currentUser" @edit="profileDialogVisible = true" />
      </div>
    </div>
  </aside>

  <RoomContactDialog v-model="contactDialogVisible" @submit="$emit('add-contact', $event)" />

  <RoomGroupDialog
    v-model="groupDialogVisible"
    :contact-candidates="contactCandidates"
    @create-group="$emit('create-group', $event)"
    @join-group="$emit('join-group', $event)"
  />

  <RoomProfileDialog
    v-model="profileDialogVisible"
    :current-user="currentUser"
    @submit="$emit('update-current-user', $event)"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import RoomConversationList from './RoomConversationList.vue'
import RoomProfileCard from './RoomProfileCard.vue'
import RoomContactDialog from './dialogs/RoomContactDialog.vue'
import RoomGroupDialog from './dialogs/RoomGroupDialog.vue'
import RoomProfileDialog from './dialogs/RoomProfileDialog.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import { SIDEBAR_TABS } from '@/constants/room'
import type { Conversation, CreateGroupPayload, UpdateCurrentUserPayload, UserProfile } from '@/types/room'

const props = defineProps<{
  conversations: Conversation[]
  currentUser: UserProfile
  selectedId: number
}>()

defineEmits<{
  select: [id: number]
  'add-contact': [account: string]
  'create-group': [payload: CreateGroupPayload]
  'join-group': [groupCode: string]
  'update-current-user': [payload: UpdateCurrentUserPayload]
}>()

const activeTab = ref<typeof SIDEBAR_TABS[number]['key']>('messages')
const searchQuery = ref('')
const contactDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const profileDialogVisible = ref(false)

const { isDark, toggleTheme } = useThemeMode()

const activeTabMeta = computed(() =>
  SIDEBAR_TABS.find(tab => tab.key === activeTab.value) ?? SIDEBAR_TABS[0],
)

const showCreateButton = computed(() =>
  activeTab.value === 'contacts' || activeTab.value === 'groups',
)

const createButtonLabel = computed(() =>
  activeTab.value === 'contacts' ? '添加联系人' : '创建或加入群聊',
)

const contactCandidates = computed(() =>
  props.conversations.filter(conversation =>
    !conversation.isGroup && typeof conversation.peerUserId === 'number',
  ),
)

const searchPlaceholder = computed(() => {
  if (activeTab.value === 'contacts')
    return '搜索联系人...'

  if (activeTab.value === 'groups')
    return '搜索群聊...'

  if (activeTab.value === 'discover')
    return '搜索发现内容...'

  return '搜索消息或联系人...'
})

const filteredConversations = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  let source = props.conversations

  if (activeTab.value === 'contacts')
    source = source.filter(conversation => !conversation.isGroup)
  else if (activeTab.value === 'groups')
    source = source.filter(conversation => conversation.isGroup)
  else if (activeTab.value === 'discover')
    source = []

  if (!keyword)
    return source

  return source.filter(conversation =>
    conversation.name.toLowerCase().includes(keyword)
    || conversation.lastMessage.toLowerCase().includes(keyword),
  )
})

const emptyHint = computed(() => {
  if (activeTab.value === 'contacts')
    return '点右上角加号，输入账号添加联系人。'

  if (activeTab.value === 'groups')
    return '点右上角加号，创建群聊或输入群号加入。'

  if (activeTab.value === 'discover')
    return '发现页先留空，后面你可以继续接功能。'

  return '切换分类或修改搜索关键词试试。'
})

const openCreateDialog = () => {
  if (activeTab.value === 'contacts') {
    contactDialogVisible.value = true
    return
  }

  if (activeTab.value === 'groups')
    groupDialogVisible.value = true
}
</script>

<style scoped>
.room-sidebar {
  display: flex;
  width: var(--room-sidebar-width);
  min-width: var(--room-sidebar-width);
  height: 100%;
  border-right: 1px solid var(--divider-color);
  background: var(--sidebar-bg);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.room-sidebar__nav,
.room-sidebar__top,
.room-sidebar__footer {
  border-color: var(--divider-color);
}

.room-sidebar__nav {
  display: flex;
  width: var(--room-nav-width);
  flex-direction: column;
  background: var(--sidebar-bg);
}

.room-sidebar__nav-item {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 16px;
  transition: all 0.25s ease;
}

.room-sidebar__nav-item--active {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

.room-sidebar__nav-item--idle {
  color: var(--text-muted);
}

.room-sidebar__nav-item--idle:hover {
  background: var(--conversation-hover-bg);
  color: var(--text-soft);
}

.room-sidebar__nav-label {
  font-size: 13px;
  letter-spacing: 0.08em;
}

.room-sidebar__icon-btn {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.room-sidebar__icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
}

.room-sidebar__search :deep(.el-input__wrapper) {
  padding: 0 16px;
  border-radius: 999px;
  background: var(--search-bg);
  box-shadow: inset 0 0 0 1px var(--input-border);
}

.room-sidebar__search :deep(.el-input__wrapper:hover) {
  box-shadow: inset 0 0 0 1px var(--input-hover-border);
}

.room-sidebar__search :deep(.el-input__wrapper.is-focus) {
  background: var(--input-focus-bg);
  box-shadow: 0 0 0 1px var(--input-focus-border);
}

.room-sidebar__search :deep(.el-input__inner) {
  height: 42px;
  font-size: 13px;
  color: var(--text-primary);
}

.room-sidebar__search :deep(.el-input__prefix-inner) {
  color: var(--text-faint);
}
</style>
