import { requestCheckUid } from 'src/api/card/card'
import * as Yup from 'yup'

export interface DeviceDataType {
  card_id?: string
  card_uid: string
  account_id: string,
  card_remark?: string,
  card_active: number,
  create_time:string,
  update_time: string,
  card_group_id: string,
  card_upload: number,
  // card_valid: 2024-12-01T15:00:00.000Z,
  // nickname: string,
  // card_access_id: null,
  // device_id: null,
  // device_sub_access: null,
  // card_access_active: null,
  // device_name: null,
  // card_group_name: null
  // [key: string]: string | number | undefined | null
}

export const CardValidationSchema = Yup.object().shape({
  device_name: Yup.string().required('請提供裝置名稱'),
  device_pos: Yup.string().nullable(),
  device_uid: Yup.string().required('請提供裝置uid'),
  device_mode: Yup.number().required('請提供裝置型別')
})
