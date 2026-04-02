<template>
  <el-dialog v-model="visible" width="420px" align-center class="room-dialog" title="编辑个人资料">
    <div class="room-dialog__copy">
      <p class="room-dialog__title">修改你的公开资料</p>
      <p class="room-dialog__desc">目前支持修改头像、名称和个性签名，账号 ID 先保持只读。</p>
    </div>

    <div class="room-dialog__section">
      <p class="room-dialog__section-title">头像</p>

      <div class="room-profile-dialog__avatar-editor">
        <UserAvatar
          class="room-profile-dialog__preview"
          :label="previewAvatarLabel"
          :color="currentUser.avatarColor"
          :image-url="form.avatarImageUrl"
          :size="72"
          alt="头像预览"
        />

        <div class="min-w-0 flex-1">
          <p class="text-sm text-ink">上传一张图片作为头像</p>
          <p class="mt-1 text-xs font-light text-ink-faint">不上传时继续使用默认文字头像。</p>

          <div class="room-profile-dialog__actions">
            <el-button type="primary" plain @click="openAvatarPicker">
              上传头像
            </el-button>
            <el-button :disabled="!form.avatarImageUrl" @click="clearAvatar">
              恢复默认
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="room-dialog__section">
      <p class="room-dialog__section-title">名称</p>
      <el-input
        v-model="form.name"
        placeholder="请输入名称"
        class="room-dialog__input"
        clearable
      />
    </div>

    <div class="room-dialog__section">
      <p class="room-dialog__section-title">账号 ID</p>
      <el-input :model-value="currentUser.account" class="room-dialog__input" disabled />
    </div>

    <div class="room-dialog__section">
      <p class="room-dialog__section-title">个性签名</p>
      <el-input
        v-model="form.signature"
        type="textarea"
        resize="none"
        :autosize="{ minRows: 3, maxRows: 5 }"
        placeholder="写一句简单介绍自己吧"
        class="room-dialog__input"
      />
    </div>

    <template #footer>
      <div class="room-dialog__footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="!form.name.trim()" @click="submitProfile">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useFileDialog } from '@vueuse/core'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { readFileAsDataUrl } from '@/utils/file'
import type { UpdateCurrentUserPayload, UserProfile } from '@/types/room'

const props = defineProps<{
  modelValue: boolean
  currentUser: UserProfile
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: UpdateCurrentUserPayload]
}>()

const form = reactive<UpdateCurrentUserPayload>({
  name: '',
  signature: '',
  avatarImageUrl: undefined,
})

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const previewAvatarLabel = computed(() =>
  form.name.trim().slice(0, 1).toUpperCase() || props.currentUser.avatar,
)

const resetForm = () => {
  form.name = props.currentUser.name
  form.signature = props.currentUser.signature
  form.avatarImageUrl = props.currentUser.avatarImageUrl
}

watch(
  () => props.modelValue,
  (value) => {
    if (value)
      resetForm()
  },
)

const {
  open: openAvatarPicker,
  reset: resetAvatarPicker,
  onChange: onAvatarSelected,
} = useFileDialog({
  accept: 'image/*',
  multiple: false,
})

onAvatarSelected(async (files) => {
  const file = files?.[0]

  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    resetAvatarPicker()
    return
  }

  try {
    form.avatarImageUrl = await readFileAsDataUrl(file)
  }
  catch {
    ElMessage.error('头像读取失败，请重试')
  }
  finally {
    resetAvatarPicker()
  }
})

const clearAvatar = () => {
  form.avatarImageUrl = undefined
}

const submitProfile = () => {
  const name = form.name.trim()
  if (!name)
    return

  emit('submit', {
    name,
    signature: form.signature.trim(),
    avatarImageUrl: form.avatarImageUrl,
  })
  visible.value = false
}
</script>

<style scoped>
.room-profile-dialog__avatar-editor {
  display: flex;
  align-items: center;
  gap: 14px;
}

.room-profile-dialog__preview {
  box-shadow: 0 12px 28px rgba(61, 79, 70, 0.14);
}

.room-profile-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
</style>
