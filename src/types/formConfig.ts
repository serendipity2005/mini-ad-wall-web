export interface FormFieldValidator {
  maxCount?: number
  minCount?: number
  url?: boolean
  number?: boolean
  required?: boolean
  min?: number
  max?: number
  pattern?: string
  message?: string
}

export interface FormFieldConfig {
  field: string
  name: string
  component: 'Input' | 'InputNumber' | 'TextArea' | 'Select'
  validator?: FormFieldValidator
  placeholder?: string
  componentProps?: Record<string, unknown>
}

export type FormConfig = FormFieldConfig[]
