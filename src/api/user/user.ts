import { UserDataType } from 'src/types/UserTypes'
import { authApiClient } from '../client'

export const ApiConfig = {
  base: 'accounts',
  byID: (id: string) => `accounts/${id}`,
  checkAccountName: (accountName: string) => `/accounts/check_account/${accountName}`,
  checkEmail: (email: string) => `/accounts/check_email/${email}`
}

export async function requestCreate(formData: UserDataType) {
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

export async function requestUpdate(id: string, formData: UserDataType | { password: string }) {
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

export async function requestCheckAccountName(accountName: string) {
  try {
    const response = await authApiClient.get(ApiConfig.checkAccountName(accountName))

    return response.data
  } catch (error) {
    console.error('發送 requestCheckAccountName 請求時發生錯誤:', error)
  }
}

export async function requestCheckEmail(email: string) {
  try {
    const response = await authApiClient.get(ApiConfig.checkEmail(email))

    return response.data
  } catch (error) {
    console.error('發送 requestCheckEmail 請求時發生錯誤:', error)
  }
}
