import { requestCheckName } from 'src/api/cardReader/device'
import * as Yup from 'yup'

export interface DeviceDataType {
  device_id?: string
  device_name: string
  device_pos?: string
  device_uid: string
  device_mode: number
  create_date?: string
  update_time?: string
  [key: string]: string | number | undefined | null
}

export const CardValidationSchema = Yup.object().shape({
  device_name: Yup.string().required('請提供裝置名稱'),
  device_pos: Yup.string().nullable(),
  device_uid: Yup.string().required('請提供裝置uid'),
  device_mode: Yup.number().required('請提供裝置型別')
})
