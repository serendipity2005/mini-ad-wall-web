<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" class="mt-4">
    <el-form-item
      v-for="field in formConfig"
      :key="field.field"
      :prop="field.field"
      :label="field.name"
      :required="field.validator?.required"
    >
      <!-- Input 组件 -->
      <el-input
        v-if="field.component === 'Input'"
        v-model="formData[field.field]"
        :placeholder="field.placeholder || `请输入${field.name}`"
        v-bind="field.componentProps"
      />

      <!-- InputNumber 组件 -->
      <el-input-number
        v-else-if="field.component === 'InputNumber'"
        v-model="formData[field.field]"
        :placeholder="field.placeholder || `请输入${field.name}`"
        :precision="2"
        :step="1"
        :min="field.validator?.min || 0"
        :max="field.validator?.max"
        controls-position="right"
        class="!w-48"
        v-bind="field.componentProps"
      />

      <!-- Textarea 组件 -->
      <el-input
        v-else-if="field.component === 'TextArea'"
        v-model="formData[field.field]"
        type="textarea"
        :rows="4"
        :placeholder="field.placeholder || `请输入${field.name}`"
        v-bind="field.componentProps"
      />

      <!-- Select 组件 -->
      <el-select
        v-else-if="field.component === 'Select'"
        v-model="formData[field.field]"
        :placeholder="field.placeholder || `请选择${field.name}`"
        v-bind="field.componentProps"
      >
        <el-option
          v-for="option in field.componentProps?.options || []"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormFieldConfig } from '@/types/formConfig'
import { buildFormRules } from '@/utils/formValidator'

const props = defineProps<{
  formConfig: FormFieldConfig[]
  form: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const formRef = ref<FormInstance>()
// 直接使用传入的 form，不创建新的 reactive
const formData = props.form

// 根据配置生成验证规则
const formRules = computed(() => buildFormRules(props.formConfig))

// 监听表单数据变化,同步到父组件
watch(
  formData,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true },
)

// 暴露验证方法给父组件
const validate = async (): Promise<boolean> => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
}
const clearValidate = () => {
  formRef.value?.clearValidate()
}
defineExpose({
  validate,
  resetFields,
  clearValidate,
})
</script>

<style scoped></style>
