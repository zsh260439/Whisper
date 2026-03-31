<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <FloatingChatWidget v-if="route.path === '/chat'" />
</template>

<script setup lang="ts">
import FloatingChatWidget from '@/components/ui/FloatingChatWidget.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
