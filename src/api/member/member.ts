import { MemberDataType } from 'src/types/MemberType'
import { authApiClient } from '../client'

export const ApiConfig = {
  base: 'members',
  byID: (id: string) => `members/${id}`
}

export async function requestCreate(formData: MemberDataType) {
  for (const key in formData) {
    if (!formData[key]) {
      delete formData[key]
    }
  }
  delete formData.confirmPassword
  await authApiClient.post(ApiConfig.base, formData)
}

export async function requestGet(id: string) {
  const response = await authApiClient.get(ApiConfig.byID(id))

  return response.data
}
