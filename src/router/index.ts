import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/chat',
      name: 'Room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '聊天' },
    },
  ],
})

export default router
