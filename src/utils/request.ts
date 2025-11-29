import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 定义接口返回的通用格式
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'api',
  timeout: 10000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const data = response.data
    if (data.code !== 200) {
      ElMessage.error(data.message)
      return Promise.reject(new Error(data.message))
    }
    response.data = data.data
    // 直接返回标准化的数据结构
    return response
  },
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)

export const get = <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
  return instance.get(url, { params })
}

export const post = <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return instance.post(url, data)
}

export const del = <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
  return instance.delete(url, { params })
}

export const put = <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return instance.put(url, data)
}

export default instance
