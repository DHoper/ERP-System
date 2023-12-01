import { useAuthContext } from 'src/context/Auth/AuthContext'
import * as Yup from 'yup'

export interface UserAccountType {
  account_id?: string
  head_portrait: string | null
  username: string
  nickname: string
  email: string
  title: string
  isActive: boolean
}

export interface UserSecurityType {
  account_id?: string
  currentPassword?: string
  password?: string
  confirmPassword?: string
}

export interface UserInfoType {
  account_id?: string
  phone: string
  address: string
  title: string
  gender: number
  birthDate: string
  intro: string
  country: string
  languages: number[]
}

export type UserDataType = UserAccountType | UserSecurityType | UserInfoType

export const UserAccountValidationSchema = Yup.object().shape({
  username: Yup.string().max(20, '帳戶名稱不可超過 20 個字符').required('請提供用戶名稱'),
  nickname: Yup.string().required('請提供姓名'),
  email: Yup.string().email('請提供有效的郵箱地址').required('請提供郵箱地址'),
  title: Yup.string().nullable(),
  isActive: Yup.number().required('請指定用戶是否啟用')
})

export const GetUserSecurityValidationSchema = () => {
  const useAuth = useAuthContext()
  const { checkPassword } = useAuth

  const schema = Yup.object().shape({
    currentPassword: Yup.string()
      .required()
      .test('is-Current', '輸入的密碼與當前密碼不符合', async function (value) {
        if (!value) return true

        console.log()

        const responseData = await checkPassword(value)
        console.log(responseData)

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
  intro: Yup.string().required('請提供自我介紹'),
  birthDate: Yup.string().required('請提供生日'),
  phone: Yup.string().required('請提供電話號碼'),
  address: Yup.string().required('請提供地址'),
  country: Yup.string().required('請提供國家'),
  languages: Yup.array().of(Yup.number()).required('請提供語言'),
  gender: Yup.number().required('請提供性別')
})
