import { useAuthContext } from 'src/context/Auth/AuthContext'
import * as Yup from 'yup'

export interface UserAccountType {
  account_id?: string
  head_portrait?: string | null
  username: string
  nickname: string
  email?: string
  group_id?: number
  title?: string
  isActive: boolean
  role: number[]
  [key: string]: string | number | number[]| boolean | undefined | null
}

export interface UserSecurityType {
  account_id?: string
  currentPassword?: string
  password?: string
  confirmPassword?: string
}

export interface UserInfoType {
  account_id?: string
  phone?: string
  address?: string
  title?: string
  gender?: number
  birthDate?: string
  line_token?: string
  intro?: string
  languages: number
  [key: string]: string | number | Date | undefined | null
}

export type UserIntersectionType = UserAccountType & UserSecurityType & UserInfoType
export type UserUnionType = UserAccountType & UserSecurityType & UserInfoType

export const UserAccountValidationSchema = Yup.object().shape({
  username: Yup.string().max(20, '帳戶名稱不可超過 20 個字符').required('請提供用戶名稱'),
  nickname: Yup.string().required('請提供姓名'),
  email: Yup.string().email('請提供有效的郵箱地址').required('請提供郵箱地址'),
  group_id: Yup.number(),
  title: Yup.string().nullable(),
  isActive: Yup.number().required('請指定用戶是否啟用')
})

export const GetUserSecurityValidationSchema = () => {
  const useAuth = useAuthContext()
  const { checkPassword } = useAuth

  const schema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('請填入帳戶當前密碼')
      .test('is-Current', '輸入的密碼與當前密碼不符合', async function (value) {
        if (!value) return true

        const responseData = await checkPassword(value)

        const isLegal = responseData

        return !!isLegal
      }),
    password: Yup.string().required('請提供密碼'),
    confirmPassword: Yup.string()
      .required('請輸入同樣的密碼')
      .oneOf([Yup.ref('password')], '密碼不一致')
  })

  return schema
}

export const UserInfoValidationSchema = Yup.object().shape({
  intro: Yup.string(),
  birthDate: Yup.string(),
  phone: Yup.string(),
  line_token: Yup.string(),
  address: Yup.string(),
  languages: Yup.number(),
  gender: Yup.number()
})
