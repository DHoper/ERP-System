import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { InputProps } from '@mui/material'

interface BaseFieldProps {
  name: string
  fieldType: string
  label?: string | ReactJSXElement
  disabled?: boolean
  sx?: object
  fullWidth: boolean
  subFields?: DynamicFormType[]
  props?: {
    [key: string]: string
  }
}

export type DynamicFormType =
  | ({
      fieldType: 'date' | 'password' | 'divider' | 'switch' | 'blankSpace'
    } & BaseFieldProps)
  | ({
      fieldType: 'text' | 'number' | 'tel' | 'email'
      minRows?: number
    } & InputProps &
      BaseFieldProps)
  | ({
      fieldType: 'select' | 'multipleSelect' | 'radioGroup' | 'checkboxGroup'
      options?: { value: any; label: string }[]
      optionSx?: object
    } & BaseFieldProps)
  | ({
      fieldType: 'checkbox' | 'button'
      startIcon?: React.ReactNode
      optionSx?: object
      color?: string
      action?: () => void
    } & BaseFieldProps)
  | ({
      fieldType: 'customizeField'
      component: JSX.Element
    } & BaseFieldProps)

export interface DynamicFormComponent {
  submitForm: () => void
  resetForm: () => void
}
