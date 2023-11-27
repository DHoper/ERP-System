import * as Yup from 'yup'

export interface UserDataType {
  account_id: string
  user_id?: string
  head_portrait: string
  username: string
  nickname: string
  password: string
  email: string
  phone: string
  address: string
  title: string
  gender: number
  birthDate: string
  intro: string
  country: string
  languages: number[]
  isActive: number
}

export interface UserAccountDataType {
  user_id?: string
  head_portrait: string
  username: string
  nickname: string
  email: string
  title: string
  isActive: boolean
}

export interface UserInfoDataType {
  user_id?: string
  phone: string
  address: string
  title: string
  gender: number
  birthDate: string
  intro: string
  country: string
  languages: number[]
}

export const UserValidationSchema = Yup.object().shape({
  _id: Yup.string(),
  head_portrait: Yup.string().required('請提供頭像圖片的 URL'),
  username: Yup.string().required('請提供用戶名稱'),
  nickname: Yup.string().required('請提供真實姓名'),
  password: Yup.string().required('請提供密碼'),
  email: Yup.string().email('請提供有效的郵箱地址').required('請提供郵箱地址'),
  phone: Yup.string().required('請提供電話號碼'),
  address: Yup.string().required('請提供地址'),
  title: Yup.string().required('請提供職稱'),
  gender: Yup.number().required('請提供性別'),
  birthDate: Yup.string().required('請提供生日'),
  intro: Yup.string().required('請提供自我介紹'),
  country: Yup.string().required('請提供國家'),
  languages: Yup.array().of(Yup.number()).required('請提供語言'),
  isActive: Yup.number().required('請指定用戶是否啟用')
})

export const UserAccountValidationSchema = Yup.object().shape({
  username: Yup.string().max(20, '帳戶名稱不可超過 20 個字符').required('請提供用戶名稱'),
  nickname: Yup.string().nullable(),
  email: Yup.string().email('請提供有效的郵箱地址').required('請提供郵箱地址'),
  title: Yup.string().nullable(),
  isActive: Yup.number().required('請指定用戶是否啟用')
})

export const UserInfoValidationSchema = Yup.object().shape({
  intro: Yup.string().required('請提供自我介紹'),
  birthDate: Yup.string().required('請提供生日'),
  phone: Yup.string().required('請提供電話號碼'),
  address: Yup.string().required('請提供地址'),
  country: Yup.string().required('請提供國家'),
  languages: Yup.array().of(Yup.number()).required('請提供語言'),
  gender: Yup.number().required('請提供性別')
})
