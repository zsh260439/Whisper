<template>
  <div
    class="relative transition-opacity duration-300"
    :class="active ? 'opacity-100' : 'opacity-0'"
    :style="{ width: width + 'px' }"
  >
    <div
      class="absolute h-0.5 rounded-full transition-all duration-300 ease-out"
      :style="{
        left: mouseX + 'px',
        width: '80px',
        marginLeft: '-40px',
        transform: `translateX(${mouseX - lastActiveX}px)`,
        backgroundColor: color,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  mouseX?: number
  active?: boolean
  width?: number
  color?: string
}>(), {
  mouseX: 0,
  active: false,
  width: 200,
  color: '#3D4F46',
})

const lastActiveX = ref(0)

watch(() => props.mouseX, (newVal) => {
  if (props.active) {
    lastActiveX.value = newVal
  }
})

watch(() => props.active, (newVal) => {
  if (newVal) {
    lastActiveX.value = props.mouseX
  }
})
</script>
