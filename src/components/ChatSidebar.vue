<template>
  <aside class="h-full flex flex-col border-r border-black/5 bg-[#fbfaf8]" style="width: 340px; min-width: 340px;">
    <div class="px-4 pt-5 pb-4 border-b border-black/4">
      <div class="mb-4 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm text-white shadow-[0_10px_24px_rgba(61,79,70,0.12)]">
          W
        </div>
        <div>
          <h1 class="text-[18px] leading-none tracking-wide text-ink">Whisper</h1>
          <p class="mt-1 text-xs font-light tracking-[0.18em] text-ink-muted">轻语</p>
        </div>

        <div class="ml-auto flex items-center gap-1">
          <button class="sidebar-icon-btn" type="button" aria-label="新建会话">
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
        placeholder="搜索联系人或消息..."
        clearable
        :prefix-icon="Search"
      />

      <div class="relative mt-4">
        <div class="absolute bottom-0 left-0 right-0 h-px bg-black/[0.05]" />
        <div class="relative flex items-center gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="relative z-10 flex-1 px-2 py-2.5 text-sm tracking-wide transition-all duration-300"
            :class="activeTab === tab.key
              ? 'text-[#263229]'
              : 'text-ink-muted hover:text-ink-soft'"
            type="button"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <div
          class="absolute bottom-0 left-0 h-[2px] rounded-full bg-primary transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :style="tabIndicatorStyle"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-3 py-3">
      <template v-if="filteredConversations.length">
        <button
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="mb-1.5 flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-left transition-all duration-300"
          :class="conversation.id === selectedId
            ? 'bg-[#f1ece4] shadow-[0_10px_24px_rgba(44,51,46,0.06)]'
            : 'hover:bg-black/[0.025]'"
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
              class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#fbfaf8] bg-[#46d7a4]"
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
          <p class="mt-1 text-xs font-light text-ink-faint">切回“消息”或修改搜索关键词试试</p>
        </div>
      </div>
    </div>

    <div class="border-t border-black/5 px-4 py-4">
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

        <button class="sidebar-icon-btn" type="button" aria-label="切换主题">
          <i class="i-carbon-moon text-base" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { Conversation } from '@/views/ChatPage.vue'

const props = defineProps<{
  conversations: Conversation[]
  selectedId: number
}>()

defineEmits<{
  select: [id: number]
}>()

const tabs = [
  { key: 'messages', label: '消息' },
  { key: 'contacts', label: '通讯录' },
  { key: 'discover', label: '发现' },
]

const activeTab = ref('messages')
const searchQuery = ref('')

const tabIndicatorStyle = computed(() => {
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab.value)

  return {
    width: `${100 / tabs.length}%`,
    transform: `translateX(${activeIndex * 100}%)`,
  }
})

const filteredConversations = computed(() => {
  if (activeTab.value !== 'messages')
    return []

  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword)
    return props.conversations

  return props.conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(keyword)
    || conversation.lastMessage.toLowerCase().includes(keyword),
  )
})
</script>

<style scoped>
.sidebar-icon-btn {
  display: inline-flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #94a3b8;
  transition: all 0.25s ease;
}

.sidebar-icon-btn:hover {
  background: rgba(61, 79, 70, 0.06);
  color: #3d4f46;
}

.search-input :deep(.el-input__wrapper) {
  padding: 0 16px;
  border-radius: 999px;
  background: #f5f2ed;
  box-shadow: inset 0 0 0 1px rgba(61, 79, 70, 0.04);
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: inset 0 0 0 1px rgba(61, 79, 70, 0.08);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 0 1px rgba(143, 168, 154, 0.35);
}

.search-input :deep(.el-input__inner) {
  height: 42px;
  font-size: 13px;
}

.search-input :deep(.el-input__prefix-inner) {
  color: #c2c8cd;
}
</style>
