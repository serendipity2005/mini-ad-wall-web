<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="isEdit ? '编辑广告' : '新建广告'"
    width="600px"
    @close="handleClose"
  >
    <el-form ref="formRef" :rules="formRules" :model="form" label-width="100px" class="mt-4">
      <el-form-item prop="title" label="广告标题" required>
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item prop="author" label="发布人" required>
        <el-input v-model="form.author" />
      </el-form-item>
      <el-form-item prop="content" label="内容文案" required>
        <el-input v-model="form.content" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item prop="landingUrl" label="落地页" required>
        <el-input v-model="form.landingUrl" />
      </el-form-item>
      <el-form-item prop="bid" label="出价" required>
        <div class="flex items-center gap-2 w-full">
          <el-input-number
            v-model="form.bid"
            :precision="2"
            :step="1"
            :min="0"
            controls-position="right"
            class="!w-48"
          />
          <span>元</span>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          isEdit ? '更新广告' : '创建广告'
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type AdForm } from '../types/ad'
import type { FormInstance, FormRules } from 'element-plus'
const formRef = ref<FormInstance>()
const props = withDefaults(
  defineProps<{
    form: AdForm
    modelValue: boolean
    title: string
    isEdit?: boolean
  }>(),
  {
    title: '新建广告',
    isEdit: false,
  },
)
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit', form: AdForm): void
  (e: 'update:modelValue', value: boolean): void
}>()
const formRules: FormRules = {
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  author: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
  content: [
    { required: true, message: '请输入广告内容', trigger: 'blur' },
    { min: 10, max: 500, message: '内容长度在 10 到 500 个字符', trigger: 'blur' },
  ],
  landingUrl: [
    { required: true, message: '请输入跳转链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' },
  ],
  bid: [
    { required: true, message: '请输入出价', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '出价必须大于0', trigger: 'blur' },
  ],
}
// 3. 处理关闭逻辑
const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:modelValue', false)
  emit('cancel')
}
const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  await formRef.value.validate((valid) => {
    console.log('yanzhneg', valid)

    if (valid) {
      emit('submit', props.form)
      emit('update:modelValue', false)
    } else {
      return false
    }
  })
}
</script>

<style scoped></style>
