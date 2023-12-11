import { CardType } from 'src/types/CardTypes'
import { authApiClient } from '../client'

export const ApiConfig = {
  base: '/cards',
  byID: (id: string) => `/cards/${id}`,
  checkUid: (card_uid: string) => `/cards/check_card_uid/${card_uid}`
}

export async function requestCreate(formData: CardType) {
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

export async function requestUpdate(id: string, formData: CardType | { password: string }) {
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

export async function requestCheckUid(card_uid: string) {
  try {
    const response = await authApiClient.get(ApiConfig.checkUid(card_uid))

    return response.data
  } catch (error) {
    console.error('發送 requestCheckUid 請求時發生錯誤:', error)
  }
}
