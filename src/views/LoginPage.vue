<template>
  <div class="flex h-screen w-screen">
    <!-- Left Panel -->
    <div class="hidden lg:flex w-1/2 relative overflow-hidden" style="background: linear-gradient(160deg, #F0F4F2 0%, #E8EDE9 40%, #F0F4F2 100%);">
      <!-- Floating shapes -->
      <div class="absolute w-32 h-32 rounded-full opacity-10 animate-float" style="top: 15%; left: 10%; background: #8FA89A;" />
      <div class="absolute w-20 h-20 rounded-2xl opacity-10 animate-float rotate-45" style="top: 60%; right: 15%; background: #C4A882; animation-delay: 2s;" />
      <div class="absolute w-24 h-24 rounded-full opacity-10 animate-float" style="bottom: 20%; left: 30%; background: #7B93A8; animation-delay: 4s;" />

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16 max-w-lg">
        <div class="animate-slide-up">
          <div class="flex items-center gap-4 mb-12">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: #3D4F46;">
              <span class="text-white text-2xl font-medium tracking-wider">W</span>
            </div>
            <div>
              <h1 class="text-3xl tracking-[0.2em] leading-none" style="color: #3D4F46; font-weight: 200;">Whisper</h1>
              <p class="text-sm mt-1 tracking-[0.15em]" style="color: #94A3B8; font-weight: 300;">轻语 · 让对话回归本质</p>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h2 class="text-4xl leading-tight tracking-wide animate-slide-up stagger-1" style="font-weight: 200; color: #3D4F46;">
            安静地<br/>
            <span class="relative inline-block">
              表达自己
              <span class="absolute bottom-1 left-0 w-full h-px" style="background: rgba(61,79,70,0.3);"></span>
            </span>
          </h2>
          <p class="leading-relaxed text-base tracking-wide animate-slide-up stagger-2" style="color: #94A3B8; font-weight: 300;">
            在这个信息过载的时代，我们相信对话应该是一件轻盈的事情。 没有噪音，没有焦虑，只是纯粹地与重要的人交流。
          </p>
        </div>

        <div class="mt-16 grid grid-cols-2 gap-4 animate-slide-up stagger-3">
          <div v-for="feature in features" :key="feature.label" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm" style="background: rgba(255,255,255,0.6);">
              <span>{{ feature.icon }}</span>
            </div>
            <span class="text-sm tracking-wide" style="color: #4A4A5A; font-weight: 300;">{{ feature.label }}</span>
          </div>
        </div>

        <p class="mt-16 text-xs tracking-[0.2em] animate-fade-in stagger-5" style="color: #C8CCD0; font-weight: 300;">
          v1.0.0 · Made with care
        </p>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-px" style="background: rgba(0,0,0,0.04);"></div>
    </div>

    <!-- Right Panel -->
    <div class="w-full lg:w-1/2 flex items-center justify-center" style="background: #FAFAF9;">
      <div class="w-full max-w-sm px-8">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-3 mb-10 animate-slide-up">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: #3D4F46;">
            <span class="text-white text-lg font-medium tracking-wider">W</span>
          </div>
          <div>
            <h1 class="text-xl tracking-[0.15em]" style="font-weight: 200; color: #1A1A2E;">Whisper</h1>
            <p class="text-xs tracking-[0.15em]" style="color: #94A3B8; font-weight: 300;">轻语</p>
          </div>
        </div>

        <div class="mb-10 animate-slide-up">
          <h2 class="text-2xl tracking-wide mb-2" style="font-weight: 300; color: #1A1A2E;">
            {{ isLogin ? '欢迎回来' : '创建账号' }}
          </h2>
          <p class="text-sm tracking-wide" style="color: #94A3B8; font-weight: 300;">
            {{ isLogin ? '登录你的账号，继续对话' : '开始你的轻语之旅' }}
          </p>
        </div>

        <!-- Tab Switcher -->
        <div class="relative flex mb-8 animate-slide-up stagger-1">
          <button
            class="flex-1 py-2.5 text-sm tracking-[0.15em] relative transition-colors duration-300 bg-transparent"
            style="font-weight: 300; outline: none;"
            :style="isLogin ? 'color: #1A1A2E' : 'color: #94A3B8'"
            @click="switchToLogin"
          >
            登录
            <span
              v-if="isLogin"
              class="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
              style="background: #3D4F46; transform: scaleX(1); transform-origin: center; transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);"
            ></span>
          </button>
          <button
            class="flex-1 py-2.5 text-sm tracking-[0.15em] relative transition-colors duration-300 bg-transparent"
            style="font-weight: 300; outline: none;"
            :style="!isLogin ? 'color: #1A1A2E' : 'color: #94A3B8'"
            @click="switchToRegister"
          >
            注册
            <span
              v-if="!isLogin"
              class="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
              style="background: #3D4F46; transform: scaleX(1); transform-origin: center; transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);"
            ></span>
          </button>
        </div>

        <!-- Form -->
        <div class="space-y-5 animate-slide-up stagger-2">
          <!-- Username (register only) -->
          <transition name="field-expand">
            <div v-if="!isLogin" class="field-group">
              <label class="block mb-2 text-xs tracking-[0.08em] uppercase" style="color: #4A4A5A; font-weight: 300;">用户名</label>
              <el-input
                v-model="form.username"
                placeholder="设置你的用户名"
                size="large"
                clearable
              />
            </div>
          </transition>

          <!-- Email -->
          <div class="field-group">
            <label class="block mb-2 text-xs tracking-[0.08em] uppercase" style="color: #4A4A5A; font-weight: 300;">邮箱</label>
            <el-input
              v-model="form.email"
              placeholder="your@email.com"
              size="large"
              clearable
            />
          </div>

          <!-- Password -->
          <div class="field-group">
            <label class="block mb-2 text-xs tracking-[0.08em] uppercase" style="color: #4A4A5A; font-weight: 300;">密码</label>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="输入密码"
              size="large"
              show-password
            />
          </div>

          <!-- Confirm Password (register only) -->
          <transition name="field-expand">
            <div v-if="!isLogin" class="field-group">
              <label class="block mb-2 text-xs tracking-[0.08em] uppercase" style="color: #4A4A5A; font-weight: 300;">确认密码</label>
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

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between mt-5 mb-7 animate-slide-up stagger-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <el-checkbox v-model="form.rememberMe" label="记住我" size="small" />
          </label>
          <button v-if="isLogin" class="text-sm transition-colors duration-300 tracking-wide hover:opacity-70" style="color: #94A3B8; font-weight: 300;">
            忘记密码?
          </button>
        </div>

        <!-- Submit -->
        <div class="animate-slide-up stagger-3">
          <button
            class="submit-btn w-full py-3 rounded-xl text-sm tracking-[0.2em] text-white transition-all duration-300 active:scale-[0.98]"
            @click="handleSubmit"
          >
            {{ isLogin ? '登 录' : '注 册' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-7 animate-fade-in stagger-4">
          <div class="flex-1 h-px" style="background: rgba(0,0,0,0.04);"></div>
          <span class="text-xs tracking-[0.2em]" style="color: #C8CCD0; font-weight: 300;">或</span>
          <div class="flex-1 h-px" style="background: rgba(0,0,0,0.04);"></div>
        </div>

        <!-- Social Login -->
        <div class="flex justify-center gap-4 animate-fade-in stagger-5">
          <button
            class="social-btn w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.003 2C6.397 2 2 6.015 2 11.003c0 2.545 1.097 4.846 2.874 6.463l-.864 3.261c-.12.452.343.823.756.602l3.22-1.644c.837.208 1.715.336 2.617.336.186 0 .37-.012.552-.026l1.847 2.118c.275.315.81.155.802-.24l-.138-7.577c-.005-.25.15-.466.374-.524C16.159 13.705 18.18 12.583 18.18 11.003 18.18 6.015 13.61 2 12.003 2z"/>
            </svg>
            <span style="font-weight: 300; letter-spacing: 0.05em;">QQ 登录</span>
          </button>
        </div>

        <!-- Terms -->
        <p class="text-center text-xs mt-8 leading-relaxed tracking-wide animate-fade-in stagger-6" style="color: #C8CCD0; font-weight: 300;">
          登录即表示你同意我们的
          <button class="transition-colors duration-300 hover:opacity-70" style="color: #94A3B8;">服务条款</button>
          和
          <button class="transition-colors duration-300 hover:opacity-70" style="color: #94A3B8;">隐私政策</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLogin = ref(true)

const features = [
  { icon: '💬', label: '端对端加密' },
  { icon: '👥', label: '群组协作' },
  { icon: '🛡️', label: '隐私保护' },
  { icon: '⚡', label: '极速同步' },
]

const socials = []

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
})

const switchToLogin = () => { isLogin.value = true }
const switchToRegister = () => { isLogin.value = false }

const handleSubmit = () => {
  router.push('/chat')
}
</script>

<style>
/* 字段展开动画 */
.field-expand-enter-active,
.field-expand-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 120px;
  opacity: 1;
  overflow: hidden;
}

.field-expand-enter-from,
.field-expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

/* ========== Element Plus 输入框强制覆盖 ========== */

/* 输入框容器 */
.el-input__wrapper,
.el-input__wrapper.is-focus,
.el-input--large .el-input__wrapper {
  padding: 1px 16px !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.04) !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

.el-input__wrapper:hover {
  border-color: rgba(143, 168, 154, 0.3) !important;
}

.el-input__wrapper.is-focus {
  border-color: rgba(143, 168, 154, 0.5) !important;
}

/* 输入框内部input */
.el-input__inner,
.el-input__inner::placeholder,
.el-input--large .el-input__inner {
  font-weight: 300 !important;
  font-size: 14px !important;
  letter-spacing: 0.02em !important;
  color: #1A1A2E !important;
}

/* 占位符 */
.el-input__inner::placeholder {
  color: #C8CCD0 !important;
  font-weight: 300 !important;
}

/* textarea */
.el-textarea__inner {
  padding: 12px 16px !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.04) !important;
  box-shadow: none !important;
  font-weight: 300 !important;
  font-size: 14px !important;
  letter-spacing: 0.02em !important;
  color: #1A1A2E !important;
  transition: all 0.3s ease !important;
}

.el-textarea__inner:hover {
  border-color: rgba(143, 168, 154, 0.3) !important;
}

.el-textarea__inner:focus {
  border-color: rgba(143, 168, 154, 0.5) !important;
  box-shadow: none !important;
}

.el-textarea__inner::placeholder {
  color: #C8CCD0 !important;
  font-weight: 300 !important;
}

/* checkbox */
.el-checkbox__label {
  font-weight: 300 !important;
  color: #4A4A5A !important;
  font-size: 14px !important;
}

.el-checkbox__input .el-checkbox__inner {
  border: none !important;
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #3D4F46 !important;
  border-color: #3D4F46 !important;
}

.el-checkbox__inner::after {
  border: none !important;
  display: none !important;
}

/* 按钮边框 - tab切换按钮 */
.relative.flex button {
  outline: none !important;
  border: none !important;
  background: transparent !important;
}

/* 文字链接按钮 - 忘记密码、服务条款、隐私政策 */
.items-center.justify-between button,
.text-center button {
  border: none !important;
  background: transparent !important;
}

/* 登录按钮 */
.submit-btn {
  background: #3D4F46 !important;
  font-weight: 300 !important;
  box-shadow: 0 2px 8px rgba(61, 79, 70, 0.15) !important;
}

/* QQ登录按钮 */
.social-btn {
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  color: #4A4A5A !important;
}
</style>
