// 引入封装好的 Axios 实例（推荐，已带请求拦截器、baseURL 等配置）
import type { AdForm } from '@/types/ad'
import request, { get, post, del } from '@/utils/request'
// 若未封装，直接引入 axios：import axios from 'axios'

// 定义 AdAPI 对象，封装所有广告相关接口
const AdAPI = {
  /**
   * 获取广告列表（示例：GET 请求）
   * @param {Object} params - 请求参数（可选）
   * @param {number} params.position - 广告位置（1：首页轮播，2：侧边栏）
   * @param {number} params.limit - 每页条数
   * @returns {Promise} - 响应结果（resolve 为接口返回数据，reject 为错误信息）
   */
  fetchAd: () => {
    return get('/ads')
  },
  createAd: (data: AdForm) => {
    console.log(data)

    return post('/ads/create', data)
  },

  deleteAd: (id: number) => {
    return del(`/ads/delete/${id}`)
  },
  clickAd: (id: number) => {
    return post(`/ads/click/${id}`)
  },
}

export default AdAPI
