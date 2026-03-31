<template>
  <aside class="w-340px h-full flex flex-col border-r border-ink-faint/30 bg-surface-warm">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-ink-faint/20">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <span class="text-sm font-light text-white">W</span>
        </div>
        <span class="text-sm font-light tracking-wider text-ink">Whisper · 轻语</span>
      </div>
      <div class="flex items-center gap-1">
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
          <i class="carbon:add text-lg" />
        </button>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
          <i class="carbon:settings text-lg" />
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="px-4 py-3">
      <el-input
        v-model="searchQuery"
        placeholder="搜索联系人..."
        clearable
        size="default"
        :prefix-icon="Search"
      />
    </div>

    <!-- Tabs -->
    <div class="px-4 mb-2 relative">
      <div class="flex relative">
        <button
          v-for="(tab, idx) in tabs"
          :key="tab.key"
          class="flex-1 py-2 text-xs font-light tracking-wider text-center transition-colors duration-300"
          :class="activeTab === tab.key ? 'text-ink' : 'text-ink-muted hover:text-ink-soft'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      <!-- Sliding indicator -->
      <div
        class="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
        :style="tabIndicatorStyle"
      />
    </div>

    <!-- Conversation List -->
    <div class="flex-1 overflow-y-auto px-2">
      <div
        v-for="conv in filteredConversations"
        :key="conv.id"
        class="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-0.5"
        :class="conv.id === selectedId ? 'bg-primary-50' : 'hover:bg-black/2'"
        @click="$emit('select', conv.id)"
      >
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-light"
            :style="{ backgroundColor: conv.avatarColor }"
          >
            {{ conv.avatar }}
          </div>
          <div
            v-if="conv.online"
            class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-surface-warm"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-normal text-ink truncate">{{ conv.name }}</span>
            <span class="text-xs text-ink-muted font-light flex-shrink-0 ml-2">{{ conv.lastTime }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-ink-muted font-light truncate">{{ conv.lastMessage }}</span>
            <el-badge
              v-if="conv.unread > 0"
              :value="conv.unread"
              :max="99"
              class="flex-shrink-0 ml-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between px-5 py-3 border-t border-ink-faint/20">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-light">
          我
        </div>
        <div>
          <p class="text-sm font-normal text-ink">我的账号</p>
          <p class="text-xs text-ink-muted font-light flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400" />
            在线
          </p>
        </div>
      </div>
      <button class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-primary-50 transition-all duration-200">
        <i class="carbon:moon text-lg" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Conversation } from '@/views/ChatPage.vue'
import { Search } from '@element-plus/icons-vue'

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
  const idx = tabs.findIndex(t => t.key === activeTab.value)
  return {
    left: `${(idx * 100) / tabs.length}%`,
    width: `${100 / tabs.length}%`,
  }
})

const filteredConversations = computed(() => {
  if (activeTab.value !== 'messages') return []
  if (!searchQuery.value.trim()) return props.conversations
  const q = searchQuery.value.toLowerCase()
  return props.conversations.filter(c =>
    c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
  )
})
</script>
