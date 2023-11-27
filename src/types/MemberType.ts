import * as Yup from 'yup'

export interface MemberDataType {
  member_id?: string
  head_portrait: string
  account: string
  nickname: string
  password: string
  confirmPassword?: string
  email: string
  phone: string
  address: string
  title: string
  gender: number
  birthDate?: string
  intro?: string
  languages?: number
  line_token?: string
  member_group_id?: string
  isActive: number
  create_time?: string
  update_time?: string
  role?: number
  [key: string]: string | number | Date | undefined | null
}

export const MemberValidationSchema = Yup.object().shape({
  _id: Yup.string(),
  head_portrait: Yup.string(),
  account: Yup.string().required('請提供用戶名稱'),
  nickname: Yup.string().required('請提供真實姓名'),
  password: Yup.string().required('請提供密碼'),
  confirmPassword: Yup.string()
    .required('請輸入同樣的密碼')
    .oneOf([Yup.ref('password')], '密碼不一致'),
  email: Yup.string().email('請提供有效的郵箱地址'),
  phone: Yup.string(),
  address: Yup.string(),
  title: Yup.string(),
  gender: Yup.number().required('請提供性別'),
  birthDate: Yup.string(),
  intro: Yup.string(),
  languages: Yup.number().required('請提供主要使用語言'),
  line_token: Yup.string(),
  member_group_id: Yup.string()
    .typeError('請輸入數字')
    .transform(value => (!value ? null : value)) //dev-c
    .test('is-number', '請輸入正確格式之ID', value => {
      return /^\d+$/.test(value!)
    })
    .max(9, 'ID位數錯誤')
    .nullable(),
  isActive: Yup.number().required('請指定用戶是否啟用')
})
