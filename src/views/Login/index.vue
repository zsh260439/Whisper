<template>
  <div class="login-page">
    <div class="login-shell">
      <header class="login-shell__top">
        <a
          class="shell-link shell-link--github"
          href="https://github.com/zsh260439"
          target="_blank"
          rel="noreferrer"
          aria-label="打开 GitHub"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-1.96c-3.2.69-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.52-2.55-.29-5.24-1.27-5.24-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.38-5.25 5.66.41.35.77 1.03.77 2.08v3.08c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
        </a>

        <div class="shell-brand">
          <div class="shell-brand__badge">W</div>
          <div class="shell-brand__text">
            <span class="shell-brand__name">Whisper</span>
            <span class="shell-brand__meta">轻语</span>
          </div>
        </div>

        <button class="shell-link shell-link--right" type="button">
          联系支持
        </button>
      </header>

      <div class="login-shell__canvas">
        <div class="login-shell__bg" :style="loginBackgroundStyle" />
        <div class="login-shell__bg-fade" />

        <div class="login-shell__center">
          <section class="auth-card">
            <div class="auth-card__head">
              <h1 class="auth-card__title">安静地<br>表达自己</h1>
              <p class="auth-card__subtitle">
                {{ isLogin ? '回到你的对话与陪伴' : '从这里开始你的轻语' }}
              </p>
            </div>

            <div class="relative mb-8 flex">
              <button
                class="auth-tab"
                :class="isLogin ? 'auth-tab--active' : 'auth-tab--idle'"
                type="button"
                @click="isLogin = true"
              >
                登录
              </button>
              <button
                class="auth-tab"
                :class="!isLogin ? 'auth-tab--active' : 'auth-tab--idle'"
                type="button"
                @click="isLogin = false"
              >
                注册
              </button>
            </div>

            <div class="auth-form">
              <transition name="field-expand">
                <div v-if="!isLogin" class="field-group">
                  <label class="field-label">用户名</label>
                  <el-input
                    v-model="form.username"
                    placeholder="设置你的用户名"
                    size="large"
                    clearable
                  />
                </div>
              </transition>

              <div class="field-group">
                <label class="field-label">邮箱</label>
                <el-input
                  v-model="form.email"
                  placeholder="your@email.com"
                  size="large"
                  clearable
                />
              </div>

              <div class="field-group">
                <label class="field-label">密码</label>
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="输入密码"
                  size="large"
                  show-password
                />
              </div>

              <transition name="field-expand">
                <div v-if="!isLogin" class="field-group">
                  <label class="field-label">确认密码</label>
                  <el-input
                    v-model="form.confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    size="large"
                    show-password
                  />
                </div>
              </transition>
            </div>

            <div class="auth-row">
              <label>
                <el-checkbox v-model="form.rememberMe" label="记住我" size="small" />
              </label>
              <button v-if="isLogin" class="auth-row__link" type="button">
                忘记密码?
              </button>
            </div>

            <button class="submit-btn" type="button" @click="handleSubmit">
              {{ isLogin ? '登 录' : '注 册' }}
            </button>

            <div class="my-7 flex items-center gap-4">
              <div class="h-px flex-1 bg-[rgba(0,0,0,0.04)]" />
              <span class="text-xs tracking-[0.2em] text-[#B6BDC2]" style="font-weight: 300;">或</span>
              <div class="h-px flex-1 bg-[rgba(0,0,0,0.04)]" />
            </div>

            <div class="flex justify-center gap-4">
              <button class="social-btn" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.003 2C6.397 2 2 6.015 2 11.003c0 2.545 1.097 4.846 2.874 6.463l-.864 3.261c-.12.452.343.823.756.602l3.22-1.644c.837.208 1.715.336 2.617.336.186 0 .37-.012.552-.026l1.847 2.118c.275.315.81.155.802-.24l-.138-7.577c-.005-.25.15-.466.374-.524C16.159 13.705 18.18 12.583 18.18 11.003 18.18 6.015 13.61 2 12.003 2z" />
                </svg>
                <span>QQ 登录</span>
              </button>
            </div>

            <p class="auth-footer-copy">
              登录即表示你同意我们的
              <button class="auth-footer-copy__link" type="button">服务条款</button>
              和
              <button class="auth-footer-copy__link" type="button">隐私政策</button>
            </p>
          </section>
        </div>

        <p class="login-shell__signature">v1.0.0 · Made with care</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import loginBackground from '@/assets/images/login-bg-golf.png'
import '@/styles/login.css'

const router = useRouter()

const isLogin = ref(true)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
})

const loginBackgroundStyle = {
  backgroundImage: `url(${loginBackground})`,
}

const handleSubmit = () => {
  router.push('/chat')
}
</script>
