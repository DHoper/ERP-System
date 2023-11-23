import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'

export interface DynamicFormType {
  name: string
  fieldType: string
  label: string | ReactJSXElement
  sx?: object
  minRows?: number
  options?: { value: any; label: string }[]
  fullWidth: boolean
  props?: {
    [key: string]: string
  }
  value?: any
  action?: () => void
}
