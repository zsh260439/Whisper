<template>
  <div class="room-empty-state">
    <div class="room-empty-state__card">
      <div class="room-empty-state__icon">
        <i class="i-carbon-chat text-3xl" />
      </div>
      <h3 class="text-lg text-ink">选择一个会话</h3>
      <p class="mt-2 text-sm font-light text-ink-muted">从左侧列表打开联系人或群聊，开始新的对话。</p>
    </div>
  </div>
</template>

<style scoped>
.room-empty-state {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.room-empty-state__card {
  padding: 48px 40px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 40px rgba(25, 32, 28, 0.04);
}

.room-empty-state__icon {
  display: flex;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: rgba(61, 79, 70, 0.08);
  color: var(--brand-bg);
}
</style>
