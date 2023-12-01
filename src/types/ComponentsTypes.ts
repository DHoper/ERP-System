import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { InputBaseComponentProps, InputProps } from '@mui/material'

// export interface DynamicFormType {
//   name: string
//   fieldType: string
//   label: string | ReactJSXElement
//   sx?: object
//   minRows?: number
//   inputProps?: InputBaseComponentProps //在此處定義字數限制等原生Input屬性
//   options?: { value: any; label: string }[]
//   fullWidth: boolean
//   props?: {
//     [key: string]: string
//   }
//   value?: any
//   startIcon?: React.ReactNode
//   color?: string
//   action?: () => void
// }

interface BaseFieldProps {
  name: string
  fieldType: string
  label: string | ReactJSXElement
  sx?: object
  fullWidth: boolean
  props?: {
    [key: string]: string
  }
}

export type DynamicFormType =
  | ({
      fieldType: 'date' | 'password' | 'divider'
    } & BaseFieldProps)
  | ({
      fieldType: 'text' | 'number' | 'tel' | 'email'
      minRows?: number
    } & InputProps &
      BaseFieldProps)
  | ({
      fieldType: 'select' | 'multipleSelect' | 'radioGroup'
      options?: { value: any; label: string }[]
    } & BaseFieldProps)
  | ({
      fieldType: 'checkbox' | 'button'
      startIcon?: React.ReactNode
      color: string
      action: () => void
    } & BaseFieldProps)
