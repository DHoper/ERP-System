import * as Yup from 'yup'

export interface LoginFormType {
  username: string
  password: string
}

export interface RegisterFormType {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ShowPasswordType {
  password: boolean
  confirmPassword: boolean
}

export const RegisterValidationSchema = Yup.object().shape({
  username: Yup.string().required('請輸入使用者名稱'),
  email: Yup.string().email('請輸入有效的郵件地址').required('請輸入Email'),
  password: Yup.string().min(6, '密碼至少需要 6 個字符').required('請輸入密碼'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], '必須與密碼相同')
    .required('請確認密碼')
})
