import { requestCheckAccountName, requestCheckEmail } from 'src/api/member/member'
import * as Yup from 'yup'

export interface MemberDataType {
  member_id?: string
  head_portrait?: string
  account: string
  nickname?: string | null
  password?: string
  confirmPassword?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  title?: string | null
  gender?: number | null
  birthDate?: Date | string | null
  intro?: string | null
  languages?: number | null
  line_token?: string | null
  member_group_id?: string | number | null
  isActive: number
  create_date?: string
  update_time?: string
  role?: number
  [key: string]: string | number | Date | undefined | null
}

export const MemberValidationSchema = Yup.object().shape({
  head_portrait: Yup.string().nullable(),
  account: Yup.string()
    .required('請提供用戶名稱')
    .test('is-Repeat', '此帳戶名稱已被使用過', async function (value) {
      const { currentAccount } = this.options.context // 待解決

      if (value === currentAccount.account) {
        return true
      }

      const isLegal = await requestCheckAccountName(value)

      return isLegal
    }),

  nickname: Yup.string().nullable(),
  password: Yup.string().required('請提供密碼'),
  confirmPassword: Yup.string()
    .required('請輸入同樣的密碼')
    .oneOf([Yup.ref('password')], '密碼不一致'),
  email: Yup.string()
    .nullable()
    .email('請提供有效的郵箱地址')
    .test('is-Repeat', '此信箱已被使用過', async function (value) {
      if (!value) return true
      const { currentAccount } = this.options.context

      if (value === currentAccount.email) {
        return true
      }

      const isLegal = await requestCheckEmail(value)

      return isLegal
    }),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  title: Yup.string().nullable(),
  gender: Yup.number().required('請提供性別'),
  birthDate: Yup.date().nullable(),
  intro: Yup.string().nullable(),
  languages: Yup.number().nullable(),
  line_token: Yup.string().nullable(),
  role: Yup.number(),
  member_group_id: Yup.string()
    .nullable()
    .typeError('請輸入數字')
    .test('is-number', '請輸入正確格式之ID', value => {
      if (value === null || value === '') {
        return true
      }

      return /^\d+$/.test(value!)
    }),
  isActive: Yup.number().required('請指定用戶是否啟用')
})
