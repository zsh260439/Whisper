<template>
  <div class="user-avatar" :style="avatarStyle">
    <img v-if="imageUrl" class="user-avatar__image" :src="imageUrl" :alt="alt" >
    <span v-else>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  color: string
  imageUrl?: string
  size?: number
  shape?: 'circle' | 'rounded'
  alt?: string
}>(), {
  imageUrl: undefined,
  size: 40,
  shape: 'circle',
  alt: '头像',
})

const avatarStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  backgroundColor: props.color,
  borderRadius: props.shape === 'rounded' ? `${Math.max(12, Math.round(props.size * 0.3))}px` : '999px',
  fontSize: `${Math.max(12, Math.round(props.size * 0.34))}px`,
}))
</script>

<style scoped>
.user-avatar {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  line-height: 1;
  user-select: none;
}

.user-avatar__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
