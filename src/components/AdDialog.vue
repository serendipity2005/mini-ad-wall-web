<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="isEdit ? '编辑广告' : '新建广告'"
    width="600px"
    @close="handleClose"
  >
  
    <DynamicForm
      v-if="formConfig.length > 0"
      ref="formRef"
      :form-config="formConfig"
      :form="form"
    />
    <div v-else class="text-center py-8 text-gray-400">加载表单配置中...</div>

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
import { ref, reactive, watch, nextTick } from 'vue'
import { type AdForm } from '../types/ad'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { FormConfig } from '@/types/formConfig'
const formRef = ref<FormInstance>()

const props = withDefaults(
  defineProps<{
    formConfig: FormConfig
    form: AdForm
    modelValue: boolean
    title?: string
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
  const isValid = await formRef.value.validate()

  if (isValid) {
    emit('submit', props.form)
    emit('update:modelValue', false)
  } else {
    ElMessage.error('请完善表单信息后提交')
  }
}
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // 对话框打开时，清除之前的验证错误
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  },
)
</script>

<style scoped></style>
