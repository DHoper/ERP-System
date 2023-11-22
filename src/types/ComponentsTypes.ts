import { MutableRefObject } from "react"

export interface DynamicFormType {
  name: string
  fieldType: string
  label: string
  sx?: object
  minRows?: number
  options?: { value: any; label: string }[]
  fullWidth: boolean
  props?: {
    [key: string]: string
  }
  value?: any
}
