import { DeviceDataType } from 'src/types/CardReaderTypes'
import { authApiClient } from '../client'

export const ApiConfig = {
  base: 'devices',
  byID: (id: string) => `devices/${id}`,
  checkName: (name: string) => `/devices/check_name/${name}`
}

export async function requestCreate(formData: DeviceDataType) {
  try {
    await authApiClient.post(ApiConfig.base, formData)
  } catch (error) {
    console.error('發送 requestCreate 請求時發生錯誤:', error)
  }
}

export async function requestGet(id: string) {
  try {
    const response = await authApiClient.get(ApiConfig.byID(id))

    return response.data
  } catch (error) {
    console.error('發送 requestGet 請求時發生錯誤:', error)
  }
}

export async function requestGetAll() {
  try {
    const response = await authApiClient.get(ApiConfig.base)

    return response.data
  } catch (error) {
    console.error('發送 requestGetAll 請求時發生錯誤:', error)
  }
}

export async function requestUpdate(id: string, formData: DeviceDataType | { password: string }) {
  try {
    const response = await authApiClient.patch(ApiConfig.byID(id), formData)

    return response.data
  } catch (error) {
    console.error('發送 requestUpdate 請求時發生錯誤:', error)
  }
}

export async function requestDelete(id: string) {
  try {
    const response = await authApiClient.delete(ApiConfig.byID(id))

    return response.data
  } catch (error) {
    console.error('發送 requestDelete 請求時發生錯誤:', error)
  }
}

export async function requestCheckName(name: string) {
  try {
    const response = await authApiClient.get(ApiConfig.checkName(name))

    return response.data
  } catch (error) {
    console.error('發送 requestCheckName 請求時發生錯誤:', error)
  }
}
