import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const onMouseMove = (e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
  })

  return { x, y }
}
