import type { CreateZoneSchema } from '@/@types/Zone'
import { api } from '@/lib/axios'

export const getAllZones = async () => {
  try {
    const response = await api.get('/zone/')
    return {
      data: response.data?.data || [],
      error: !response.data?.success,
      message: response.data?.message,
    }
  } catch (error: any) {
    console.log({ error })
    return {
      error: true,
      message: error.response?.data?.message || error.message,
    }
  }
}

export const getZonesByType = async (type: 'SAFE' | 'DANGER') => {
  try {
    const response = await api.get(`/zone/type/${type}`)
    return {
      data: response.data?.data || [],
      error: !response.data?.success,
      message: response.data?.message,
    }
  } catch (error: any) {
    console.log({ error })
    return {
      error: true,
      message: error.response?.data?.message || error.message,
    }
  }
}

export const createZone = async (data: CreateZoneSchema) => {
  try {
    const response = await api.post('/zone/', data)
    return {
      data: response.data?.data,
      error: !response.data?.success,
      message: response.data?.message,
    }
  } catch (error: any) {
    console.log({ error })
    return {
      error: true,
      message: error.response?.data?.message || error.message,
    }
  }
}
