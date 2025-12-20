<template>
  <!-- Card Header -->
  <div class="flex justify-between items-start mb-4" @click="emit('clickCard', props.ad)">
    <h3 class="font-bold break-all max-w-[80%] text-gray-900 text-base">{{ title }}</h3>
    <el-dropdown trigger="click">
      <button
        @click.stop
        class="border border-gray-200 rounded px-3 py-1 text-xs text-gray-600 flex items-center gap-1 hover:bg-gray-50 cursor-pointer bg-white hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors outline-none"
      >
        操作
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click.stop="emit('edit', props.ad)">编辑广告</el-dropdown-item>

          <el-dropdown-item @click.stop="emit('copy', props.ad)">复制广告</el-dropdown-item>

          <el-dropdown-item @click.stop="handleDelete">删除广告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <!-- Card Content -->
  <div class="text-gray-500 text-sm mb-8 min-h-[20px]">
    {{ content }}
  </div>

  <!-- Card Footer -->
  <div class="flex justify-between items-center text-sm">
    <div class="text-red-500">热度：{{ clicks }}</div>
    <div class="text-[#1E40AF] font-medium">出价：{{ price }}</div>
  </div>
</template>

<script setup lang="ts">
import { type Ad } from '@/types/ad.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps<{
  clicks: number
  content: string
  title: string
  price: number
  ad: Ad
}>()

const emit = defineEmits(['edit', 'copy', 'delete', 'clickCard'])
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      emit('delete', props.ad)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    } catch {
      ElMessage({
        type: 'error',
        message: '删除失败',
      })
    }
  })
}
</script>

<style scoped lang="scss"></style>
