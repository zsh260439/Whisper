<template>
  <el-dialog v-model="visible" width="420px" align-center class="room-dialog" title="添加联系人">
    <div class="room-dialog__copy">
      <p class="room-dialog__title">输入对方账号</p>
      <p class="room-dialog__desc">输入完整账号后，即可把对方加入联系人列表。</p>
    </div>

    <el-input
      v-model="account"
      placeholder="请输入对方账号"
      class="room-dialog__input"
      clearable
      @keydown.enter.prevent="submitContact"
    />

    <template #footer>
      <div class="room-dialog__footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="!account.trim()" @click="submitContact">
          添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [account: string]
}>()

const account = ref('')

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(
  () => props.modelValue,
  (value) => {
    if (value)
      account.value = ''
  },
)

const submitContact = () => {
  const trimmed = account.value.trim()
  if (!trimmed)
    return

  emit('submit', trimmed)
  visible.value = false
}
</script>
