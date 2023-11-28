import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { InputBaseComponentProps } from '@mui/material'

export interface DynamicFormType {
  name: string
  fieldType: string
  label: string | ReactJSXElement
  sx?: object
  minRows?: number
  inputProps?: InputBaseComponentProps //在此處定義字數限制等原生Input屬性
  options?: { value: any; label: string }[]
  fullWidth: boolean
  props?: {
    [key: string]: string
  }
  value?: any
  startIcon?: React.ReactNode
  color?: string
  action?: () => void
}

// 定義 fieldType 對應的屬性結構

// interface BaseFieldProps {
//   name: string
//   fieldType: string
//   label: string | ReactJSXElement
//   sx?: object
//   fullWidth: boolean
//   props?: {
//     [key: string]: string
//   }
// }

// interface TextField extends BaseFieldProps {
//   textType: 'number' | 'text'
//   inputProps: InputProps //在此處定義字數限制等原生Input屬性
//   minRows?: number
// }

// interface OptionalField extends BaseFieldProps {
//   options?: { value: any; label: string }[]
// }

// interface ActionField extends BaseFieldProps {
//   startIcon?: React.ReactNode
//   action: () => void
// }

// export type DynamicFormType = TextField | OptionalField | ActionField
