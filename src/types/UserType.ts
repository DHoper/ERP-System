import * as Yup from 'yup'

export interface UserDataType {
  _id?: string
  avatarImgUrl: string
  username: string
  name: string
  password: string
  email: string
  phone: string
  address: string
  jobTitle: string
  gender: number
  department: number
  birthDate: string
  intro: string
  country: string
  languages: number[]
  isActive: boolean
}

export interface UserAccountDataType {
  _id?: string
  avatarImgUrl: string
  username: string
  name: string
  email: string
  jobTitle: string
  isActive: boolean
}

export interface UserInfoDataType {
  _id?: string
  phone: string
  address: string
  jobTitle: string
  gender: number
  birthDate: string
  intro: string
  country: string
  languages: number[]
}

export const UserVaildationSchema = Yup.object().shape({
  _id: Yup.string(),
  avatarImgUrl: Yup.string().required('請提供頭像圖片的 URL'),
  username: Yup.string().required('請提供用戶名稱'),
  name: Yup.string().required('請提供真實姓名'),
  password: Yup.string().required('請提供密碼'),
  email: Yup.string().email('請提供有效的郵箱地址').required('請提供郵箱地址'),
  phone: Yup.string().required('請提供電話號碼'),
  address: Yup.string().required('請提供地址'),
  jobTitle: Yup.string().required('請提供職稱'),
  gender: Yup.number().required('請提供性別'),
  department: Yup.number().required('請提供部門'),
  birthDate: Yup.string().required('請提供生日'),
  intro: Yup.string().required('請提供自我介紹'),
  country: Yup.string().required('請提供國家'),
  languages: Yup.array().of(Yup.number()).required('請提供語言'),
  isActive: Yup.boolean().required('請指定用戶是否啟用')
})

export const UserInfoVaildationSchema = Yup.object().shape({
  intro: Yup.string().required('請提供自我介紹'),
  birthDate: Yup.string().required('請提供生日'),
  phone: Yup.string().required('請提供電話號碼'),
  address: Yup.string().required('請提供地址'),
  country: Yup.string().required('請提供國家'),
  languages: Yup.array().of(Yup.number()).required('請提供語言'),
  gender: Yup.number().required('請提供性別')
})

export const UserAccountVaildationSchema = Yup.object().shape({
  username: Yup.string().max(20, '帳戶名稱不可超過 20 個字符').required('請提供用戶名稱'),
  name: Yup.string().required('請提供真實姓名'),
  email: Yup.string().email('請提供有效的郵箱地址').required('請提供郵箱地址'),
  jobTitle: Yup.string().required('請提供職稱'),
  department: Yup.number().required('請選擇部門'),
  isActive: Yup.boolean().required('請指定用戶是否啟用')
})
