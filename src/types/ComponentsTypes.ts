import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { InputProps } from '@mui/material'

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

export interface DynamicFormComponent {
  submitForm: () => void
  resetForm: () => void
}
