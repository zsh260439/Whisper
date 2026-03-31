<template>
  <aside
    class="sidebar-shell h-full flex border-r"
    :style="{ width: '380px', minWidth: '380px' }"
  >
    <div class="sidebar-nav border-r px-3 py-4">
      <div class="mb-4 flex justify-center">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm text-white shadow-[0_10px_24px_rgba(61,79,70,0.12)]">
          W
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="nav-item"
          :class="activeTab === tab.key ? 'nav-item--active' : 'nav-item--idle'"
          type="button"
          @click="activeTab = tab.key"
        >
          <span class="nav-item__label">{{ tab.label }}</span>
        </button>
      </div>

      <button class="sidebar-icon-btn mt-4 self-center" type="button" aria-label="切换主题" @click="changeBackGround">
        <i :class="isDarkPage ? 'i-carbon-sun text-base' : 'i-carbon-moon text-base'" />
      </button>
    </div>

    <div class="min-w-0 flex flex-1 flex-col">
      <div class="sidebar-top border-b px-4 pt-5 pb-4">
        <div class="mb-4 flex items-center gap-3">
          <div>
            <h1 class="text-[18px] leading-none tracking-wide text-ink">{{ activeTabMeta.label }}</h1>
            <p class="mt-1 text-xs font-light tracking-[0.18em] text-ink-muted">Whisper</p>
          </div>

          <div class="ml-auto flex items-center gap-1">
            <button
              v-if="showCreateButton"
              class="sidebar-icon-btn"
              type="button"
              :aria-label="createButtonLabel"
              @click="openCreateDialog"
            >
              <i class="i-carbon-add text-lg" />
            </button>
            <button class="sidebar-icon-btn" type="button" aria-label="设置">
              <i class="i-carbon-settings text-lg" />
            </button>
          </div>
        </div>

        <el-input
          v-model="searchQuery"
          class="search-input"
          :placeholder="searchPlaceholder"
          clearable
          :prefix-icon="Search"
        />
      </div>

      <div class="flex-1 overflow-y-auto px-3 py-3">
        <template v-if="filteredConversations.length">
          <button
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="conversation-item mb-1.5 flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-left transition-all duration-300"
            :class="conversation.id === selectedId ? 'conversation-item--active' : 'conversation-item--idle'"
            type="button"
            @click="$emit('select', conversation.id)"
          >
            <div class="relative shrink-0">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full text-sm text-white"
                :style="{ backgroundColor: conversation.avatarColor }"
              >
                {{ conversation.avatar }}
              </div>
              <span
                v-if="conversation.online"
                class="online-dot absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2"
              />
            </div>

            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-start justify-between gap-2">
                <span class="truncate text-[15px] tracking-wide text-ink">{{ conversation.name }}</span>
                <span
                  class="shrink-0 text-[11px]"
                  :class="conversation.unread > 0 ? 'text-primary' : 'text-ink-faint'"
                >
                  {{ conversation.lastTime }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-xs font-light leading-relaxed text-ink-muted">
                  {{ conversation.lastMessage }}
                </p>
                <span
                  v-if="conversation.unread > 0"
                  class="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-white"
                >
                  {{ conversation.unread }}
                </span>
              </div>
            </div>
          </button>
        </template>

        <div v-else class="flex h-full items-center justify-center px-6 text-center">
          <div>
            <p class="text-sm text-ink-soft">当前分类暂无内容</p>
            <p class="mt-1 text-xs font-light text-ink-faint">{{ emptyHint }}</p>
          </div>
        </div>
      </div>

      <div class="sidebar-footer border-t px-4 py-4">
        <div class="flex items-center gap-3 rounded-[18px] px-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4A882] text-sm text-white">
            我
          </div>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm tracking-wide text-ink">我的账号</p>
            <p class="mt-1 flex items-center gap-1 text-xs font-light text-ink-muted">
              <span class="h-1.5 w-1.5 rounded-full bg-[#46d7a4]" />
              在线
            </p>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <el-dialog
    v-model="contactDialogVisible"
    width="420px"
    align-center
    class="sidebar-dialog"
    title="添加联系人"
  >
    <div class="dialog-copy">
      <p class="dialog-title">输入对方账号</p>
      <p class="dialog-desc">输入完整账号后，即可把对方加入联系人列表。</p>
    </div>

    <el-input
      v-model="contactAccount"
      placeholder="请输入对方账号"
      class="dialog-input"
      clearable
      @keydown.enter.prevent="submitContact"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="contactDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!contactAccount.trim()" @click="submitContact">
          添加
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="groupDialogVisible"
    width="520px"
    align-center
    class="sidebar-dialog"
    title="群聊"
  >
    <div class="dialog-mode-bar">
      <button
        class="dialog-mode-btn"
        :class="groupAction === 'create' ? 'dialog-mode-btn--active' : 'dialog-mode-btn--idle'"
        type="button"
        @click="groupAction = 'create'"
      >
        创建群聊
      </button>
      <button
        class="dialog-mode-btn"
        :class="groupAction === 'join' ? 'dialog-mode-btn--active' : 'dialog-mode-btn--idle'"
        type="button"
        @click="groupAction = 'join'"
      >
        加入群聊
      </button>
    </div>

    <template v-if="groupAction === 'create'">
      <div class="dialog-copy">
        <p class="dialog-title">创建新的群聊</p>
        <p class="dialog-desc">群号会在创建后由后台自动生成，这里先按本地演示逻辑模拟。</p>
      </div>

      <div class="dialog-section">
        <p class="dialog-section__title">群头像</p>
        <div class="avatar-grid">
          <button
            v-for="option in groupAvatarOptions"
            :key="`${option.label}-${option.color}`"
            class="avatar-option"
            :class="selectedAvatar.label === option.label && selectedAvatar.color === option.color ? 'avatar-option--active' : ''"
            type="button"
            @click="selectedAvatar = option"
          >
            <span class="avatar-option__badge" :style="{ backgroundColor: option.color }">
              {{ option.label }}
            </span>
          </button>
        </div>
      </div>

      <div class="dialog-section">
        <p class="dialog-section__title">群名称</p>
        <el-input
          v-model="groupName"
          placeholder="请输入群聊名称"
          class="dialog-input"
          clearable
        />
      </div>

      <div class="dialog-section">
        <div class="dialog-section__head">
          <p class="dialog-section__title">邀请联系人</p>
          <span class="dialog-section__meta">已选 {{ selectedMemberIds.length }} 人</span>
        </div>

        <div v-if="contactCandidates.length" class="member-list">
          <button
            v-for="contact in contactCandidates"
            :key="contact.id"
            class="member-item"
            :class="isSelectedMember(contact) ? 'member-item--active' : ''"
            type="button"
            @click="toggleMember(contact)"
          >
            <div class="member-item__avatar" :style="{ backgroundColor: contact.avatarColor }">
              {{ contact.avatar }}
            </div>
            <div class="min-w-0 flex-1 text-left">
              <p class="truncate text-[13px] text-ink">{{ contact.name }}</p>
              <p class="truncate text-[11px] text-ink-faint">{{ contact.lastMessage }}</p>
            </div>
          </button>
        </div>

        <div v-else class="dialog-empty">
          还没有可邀请的联系人，先去联系人里添加账号吧。
        </div>
      </div>

    </template>

    <template v-else>
      <div class="dialog-copy">
        <p class="dialog-title">输入群号加入群聊</p>
        <p class="dialog-desc">这里只需要输入群号，群资料会在加入后由后台返回。</p>
      </div>

      <el-input
        v-model="groupCode"
        placeholder="请输入群号"
        class="dialog-input"
        clearable
        @keydown.enter.prevent="submitGroupAction"
      />
    </template>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="groupActionDisabled" @click="submitGroupAction">
          {{ groupAction === 'create' ? '创建' : '加入' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { Conversation } from '@/views/ChatPage.vue'

interface GroupAvatarOption {
  label: string
  color: string
}

const props = defineProps<{
  conversations: Conversation[]
  selectedId: number
}>()

const emit = defineEmits<{
  select: [id: number]
  addContact: [account: string]
  createGroup: [payload: {
    name: string
    avatar: string
    avatarColor: string
    memberIds: number[]
  }]
  joinGroup: [groupCode: string]
}>()

const tabs = [
  { key: 'messages', label: '消息' },
  { key: 'contacts', label: '联系人' },
  { key: 'groups', label: '群聊' },
  { key: 'discover', label: '发现' },
] as const

const groupAvatarOptions: GroupAvatarOption[] = [
  { label: '群', color: '#91A896' },
  { label: '聊', color: '#8097AA' },
  { label: '友', color: '#CAA97F' },
  { label: '游', color: '#D4A39B' },
  { label: '书', color: '#8AA1B8' },
  { label: '音', color: '#C89289' },
  { label: '影', color: '#7E9D8E' },
  { label: '队', color: '#A68AC0' },
]

const activeTab = ref<typeof tabs[number]['key']>('messages')
const searchQuery = ref('')
const isDarkPage = ref(document.body.classList.contains('dark-page'))

const contactDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const contactAccount = ref('')
const groupAction = ref<'create' | 'join'>('create')
const groupName = ref('')
const groupCode = ref('')
const selectedMemberIds = ref<number[]>([])
const selectedAvatar = ref<GroupAvatarOption>(groupAvatarOptions[0])

const changeBackGround = () => {
  document.body.classList.toggle('dark-page')
  isDarkPage.value = document.body.classList.contains('dark-page')
}

const activeTabMeta = computed(() =>
  tabs.find(tab => tab.key === activeTab.value) ?? tabs[0],
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

const groupActionDisabled = computed(() => {
  if (groupAction.value === 'create')
    return !groupName.value.trim() || selectedMemberIds.value.length === 0

  return !groupCode.value.trim()
})

const resetContactDialog = () => {
  contactAccount.value = ''
}

const resetGroupDialog = () => {
  groupAction.value = 'create'
  groupName.value = ''
  groupCode.value = ''
  selectedMemberIds.value = []
  selectedAvatar.value = groupAvatarOptions[0]
}

const openCreateDialog = () => {
  if (activeTab.value === 'contacts') {
    resetContactDialog()
    contactDialogVisible.value = true
    return
  }

  if (activeTab.value === 'groups') {
    resetGroupDialog()
    groupDialogVisible.value = true
  }
}

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

const submitContact = () => {
  const account = contactAccount.value.trim()

  if (!account)
    return

  emit('addContact', account)
  contactDialogVisible.value = false
  resetContactDialog()
}

const submitGroupAction = () => {
  if (groupAction.value === 'create') {
    emit('createGroup', {
      name: groupName.value.trim(),
      avatar: selectedAvatar.value.label,
      avatarColor: selectedAvatar.value.color,
      memberIds: [...selectedMemberIds.value],
    })
  }
  else {
    emit('joinGroup', groupCode.value.trim())
  }

  groupDialogVisible.value = false
  resetGroupDialog()
}
</script>

<style scoped>
.sidebar-shell {
  background: var(--sidebar-bg);
  border-color: var(--divider-color);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.sidebar-nav,
.sidebar-top,
.sidebar-footer {
  border-color: var(--divider-color);
}

.sidebar-nav {
  display: flex;
  width: 88px;
  flex-direction: column;
  background: var(--sidebar-bg);
}

.nav-item {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0 8px;
  transition: all 0.25s ease;
}

.nav-item__label {
  font-size: 13px;
  letter-spacing: 0.08em;
}

.nav-item--active {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
  box-shadow: var(--conversation-active-shadow);
}

.nav-item--idle {
  color: var(--text-muted);
}

.nav-item--idle:hover {
  background: var(--conversation-hover-bg);
  color: var(--text-soft);
}

.conversation-item--active {
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}

.conversation-item--idle:hover {
  background: var(--conversation-hover-bg);
}

.online-dot {
  background: var(--online-color);
  border-color: var(--online-ring);
}

.sidebar-icon-btn {
  display: inline-flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: var(--icon-color);
  transition: all 0.25s ease;
}

.sidebar-icon-btn:hover {
  background: var(--icon-hover-bg);
  color: var(--text-primary);
}

.search-input :deep(.el-input__wrapper) {
  padding: 0 16px;
  border-radius: 999px;
  background: var(--search-bg);
  box-shadow: inset 0 0 0 1px var(--input-border);
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: inset 0 0 0 1px var(--input-hover-border);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  background: var(--input-focus-bg);
  box-shadow: 0 0 0 1px var(--input-focus-border);
}

.search-input :deep(.el-input__inner) {
  height: 42px;
  font-size: 13px;
  color: var(--text-primary);
}

.search-input :deep(.el-input__prefix-inner) {
  color: var(--text-faint);
}

.dialog-copy {
  margin-bottom: 16px;
}

.dialog-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 15px;
  letter-spacing: 0.03em;
}

.dialog-desc {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.65;
}

.dialog-section + .dialog-section {
  margin-top: 18px;
}

.dialog-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dialog-section__title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 13px;
  letter-spacing: 0.04em;
}

.dialog-section__meta {
  color: var(--text-faint);
  font-size: 11px;
}

.dialog-input {
  margin-top: 6px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-mode-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.dialog-mode-btn {
  flex: 1;
  height: 40px;
  border-radius: 14px;
  transition: all 0.25s ease;
}

.dialog-mode-btn--active {
  background: var(--brand-bg);
  color: #fff;
  box-shadow: var(--send-enabled-shadow);
}

.dialog-mode-btn--idle {
  background: var(--conversation-hover-bg);
  color: var(--text-muted);
}

.dialog-mode-btn--idle:hover {
  background: var(--conversation-active-bg);
  color: var(--text-primary);
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.avatar-option {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  border: 1px solid var(--divider-color);
  border-radius: 18px;
  background: var(--conversation-hover-bg);
  transition: all 0.25s ease;
}

.avatar-option--active {
  border-color: rgba(61, 79, 70, 0.22);
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
}

.avatar-option__badge {
  display: inline-flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.05em;
}

.member-list {
  max-height: 208px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 2px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 8px 10px;
  border: 1px solid var(--divider-color);
  border-radius: 16px;
  background: transparent;
  transition: all 0.25s ease;
}

.member-item--active {
  background: var(--conversation-active-bg);
  box-shadow: var(--conversation-active-shadow);
  border-color: rgba(61, 79, 70, 0.16);
}

.member-item__avatar {
  display: flex;
  height: 34px;
  width: 34px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
}

.dialog-empty {
  padding: 12px 14px;
  border: 1px dashed var(--divider-color);
  border-radius: 16px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.65;
}

:deep(.sidebar-dialog) {
  border-radius: 24px;
}

:deep(.sidebar-dialog .el-dialog) {
  border: 1px solid var(--divider-color);
  border-radius: 24px;
  background: var(--sidebar-bg);
  box-shadow: 0 24px 60px rgba(25, 32, 28, 0.14);
}

:deep(.sidebar-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 20px 20px 8px;
}

:deep(.sidebar-dialog .el-dialog__title) {
  color: var(--text-primary);
  font-size: 18px;
  letter-spacing: 0.04em;
}

:deep(.sidebar-dialog .el-dialog__body) {
  padding: 12px 20px 10px;
}

:deep(.sidebar-dialog .el-dialog__footer) {
  padding: 8px 20px 20px;
}
</style>
