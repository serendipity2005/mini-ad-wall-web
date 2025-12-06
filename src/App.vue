<script setup lang="ts">
import { ref, reactive, onMounted, type Ref } from 'vue'
import AdCard from '@/components/AdCard.vue'
import AdDialog from '@/components/AdDialog.vue'
import AdAPI from './api/ad'
import type { AdForm } from './types/ad'
import { ElMessage } from 'element-plus'
import type { FormFieldConfig } from './types/formConfig'

export interface Ad {
  id: number
  title: string
  content: string
  author: string
  clicks: number
  bid: number
  landingUrl: string
}

const ads = ref<Ad[]>([])
const isEdit = ref<boolean>(false)
const currentAd = ref<Ad | null>(null)

const dialogVisible = ref(false)
const formConfig = ref<FormFieldConfig[]>([])
let form = reactive({
  title: '',
  author: '',
  content: '',
  landingUrl: '',
  bid: 0.0,
})
// 获取表单配置
const getFormConfig = async () => {
  try {
    const res = await AdAPI.fetchFormConfig()
    console.log('获取表单配置成功', res.data)
    formConfig.value = res.data
  } catch (error) {
    ElMessage.error('获取表单配置失败')
    console.error(error)
  }
}
const handleVisible = (isVisble: boolean) => {
  dialogVisible.value = isVisble
}

const handleCreate = async () => {
  dialogVisible.value = true
  isEdit.value = false
  clearForm() // 先清空
  await getFormConfig()
}

const clearForm = () => {
  Object.assign(form, {
    title: '',
    author: '',
    content: '',
    landingUrl: '',
    bid: 0.0,
  })
}

const fillForm = (ad: Ad) => {
  clearForm()
  Object.assign(form, {
    title: ad.title,
    author: ad.author,
    content: ad.content,
    bid: Number(ad.bid),
    landingUrl: ad.landingUrl,
  })
}
const handleSubmit = async (form: AdForm) => {
  dialogVisible.value = false
  if (isEdit.value) {
    await AdAPI.updateAd(currentAd.value!.id, form)
  } else {
    await AdAPI.createAd(form)
  }
  isEdit.value = false
  getAds()
  ElMessage.success('成功提交')
  clearForm()
}
// 获取广告列表
const getAds = async () => {
  const res = await AdAPI.fetchAd()
  ads.value = res.data
  return res.data
}

const handleDelete = async (id: number) => {
  await AdAPI.deleteAd(id)
  getAds()
}
const handleEdit = async (ad: Ad) => {
  currentAd.value = ad
  isEdit.value = true
  console.log(ad);
  
  await getFormConfig()
  handleVisible(true)
  fillForm(ad)
}
const handleCopy = async (ad: Ad) => {
  isEdit.value = false
  // 复制数据到表单（不包含 id）
  currentAd.value = null

  await getFormConfig()

  fillForm(ad)
  dialogVisible.value = true
}
const handleClick = async (ad: Ad) => {
  await AdAPI.clickAd(ad.id)
  await getAds()
  window.open(ad.landingUrl, '_blank')
}

onMounted(async () => {
  await getAds()
})
</script>

<template>
  <div class="min-h-screen bg-[#F5F7FA] font-sans text-gray-900">
    <!-- Header -->
    <header class="bg-white h-16 px-6 flex items-center shadow-sm sticky top-0 z-10">
      <div class="font-bold text-lg">Mini广告墙</div>
    </header>

    <!-- Main Content -->
    <main class="p-6 max-w-[1600px] mx-auto w-full">
      <!-- Action Bar -->
      <div class="mb-6">
        <button
          @click="handleCreate"
          class="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-sm flex items-center gap-1 text-sm transition-colors cursor-pointer shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          新增广告
        </button>
      </div>

      <!-- Ad Grid -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="ad in ads"
          :key="ad.id"
          class="cursor-pointer bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          @click="handleClick(ad)"
        >
          <AdCard
            :ad="ad"
            :content="ad.content"
            :title="ad.title"
            :price="ad.bid"
            :clicks="ad.clicks"
            @delete="handleDelete(ad.id)"
            @edit="handleEdit"
            @copy="handleCopy"
          />
        </div>
      </div>

      <!-- Create Ad Dialog -->
      <AdDialog
        :form-config="formConfig"
        :is-edit="isEdit"
        :form="form"
        v-model="dialogVisible"
        @submit="handleSubmit( form)"
      />
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
