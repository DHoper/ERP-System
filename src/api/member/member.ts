import { MemberDataType } from 'src/types/MemberType'
import { authApiClient } from '../client'

export const ApiConfig = {
  base: 'members',
  byID: (id: string) => `members/${id}`,
  checkAccountName: (accountName: string) => `/members/check_account/${accountName}`,
  checkEmail: (email: string) => `/members/check_email/${email}`
}

export async function requestCreate(formData: MemberDataType) {
  try {
    await authApiClient.post(ApiConfig.base, formData)
  } catch (error) {
    console.error('執行 requestCreate 請求時發生錯誤:', error)
  }
}

export async function requestGet(id: string) {
  try {
    const response = await authApiClient.get(ApiConfig.byID(id))

    return response.data
  } catch (error) {
    console.error('執行 requestGet 請求時發生錯誤:', error)
  }
}

export async function requestGetAll() {
  try {
    const response = await authApiClient.get(ApiConfig.base)

    return response.data
  } catch (error) {
    console.error('執行 requestGetAll 請求時發生錯誤:', error)
  }
}

export async function requestUpdate(id: string, formData: MemberDataType | { password: string }) {
  try {
    const response = await authApiClient.patch(ApiConfig.byID(id), formData)

    return response.data
  } catch (error) {
    console.error('執行 requestUpdate 請求時發生錯誤:', error)
  }
}

export async function requestDelete(id: string) {
  try {
    const response = await authApiClient.delete(ApiConfig.byID(id))

    return response.data
  } catch (error) {
    console.error('執行 requestDelete 請求時發生錯誤:', error)
  }
}

export async function requestCheckAccountName(accountName: string) {
  try {
    const response = await authApiClient.get(ApiConfig.checkAccountName(accountName))

    return response.data
  } catch (error) {
    console.error('執行 requestCheckAccountName 請求時發生錯誤:', error)
  }
}

export async function requestCheckEmail(email: string) {
  try {
    const response = await authApiClient.get(ApiConfig.checkEmail(email))

    return response.data
  } catch (error) {
    console.error('執行 requestCheckEmail 請求時發生錯誤:', error)
  }
}
