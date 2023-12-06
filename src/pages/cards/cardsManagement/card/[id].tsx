// ** React Imports
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import {
  Grid,
  CardContent,
  Button,
  Stack,
  Card,
  styled,
  Collapse,
  CardActions,
  useTheme,
  IconButton,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Select,
  Switch
} from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import CloseIcon from '@mui/icons-material/Close'

import DynamicForm from 'src/views/form/DynamicForm'
import { DynamicFormComponent, DynamicFormType } from 'src/types/ComponentsTypes'
import { requestCheckName, requestCreate, requestDelete, requestGet, requestUpdate } from 'src/api/cardReader/device'
import { DeviceDataType, DeviceValidationSchema } from 'src/types/CardReaderTypes'
import useConfirm from 'src/views/message/WarningConfirmDialog'
import { useSnackbarContext } from 'src/context/SnackbarContext'
import { Controller, UseFormReturn, useFormContext, useWatch } from 'react-hook-form'
import { padding } from '@mui/system'
import { CardValidationSchema } from 'src/types/CardTypes'
import { string } from 'yup'

const StyledButton = styled(Button)({
  backgroundColor: 'white',
  color: '#9155FD',
  marginBottom: '1rem',
  '&:hover': {
    backgroundColor: '#9155FD',
    color: 'white'
  }
})

const handleWatchPermission = (watchedField: any, methods: UseFormReturn<any>) => {
  const { setValue, getValues } = methods

  const customizePermissions = getValues('customizePermissions')

  if (watchedField) {
    for (const permission in customizePermissions) {
      setValue(`customizePermissions[${permission}]`, true, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
    }
  }

  if (watchedField !== 99) {
    for (const field of dynamicFormFields) {
      if (field.name === 'customizePermissions') {
        field.disabled = true
        // field.sx = { visibility: 'visible' }
      }
    }
  } else {
    for (const field of dynamicFormFields) {
      if (field.name === 'customizePermissions') {
        field.disabled = false
        // field.sx = { visibility: 'hidden' }
      }
    }
  }
}
const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'divider',
    fieldType: 'divider',
    label: '裝置資訊',
    fullWidth: true
  },

  {
    name: 'device_name',
    fieldType: 'text',
    label: '裝置名稱',
    fullWidth: false
  },
  {
    name: 'device_pos',
    fieldType: 'text',
    label: '裝設位置',
    fullWidth: false
  },
  {
    name: 'account_id',
    fieldType: 'text',
    label: '使用者',
    fullWidth: false
  },
  {
    name: 'device_mode',
    label: '裝置類型',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 0, label: '讀卡' },
      { value: 1, label: '開卡' }
    ]
  },
  {
    name: 'permissionType',
    label: '權限別',
    fieldType: 'select',
    fullWidth: true,
    sx: { border: 'solid red 1px' },
    options: [
      { value: 0, label: '一般員工' },
      { value: 1, label: '警衛' },
      { value: 2, label: '資訊部人員' },
      { value: 99, label: '自定義權限' }
    ]
  },
  {
    name: 'customizePermissions',
    label: '權限',
    fieldType: 'checkboxGroup',
    fullWidth: true,
    disabled: true,
    optionSx: {
      '&.Mui-disabled': {
        color: '#9155FD'
      }
    },
    options: [
      { value: 0, label: '大門' },
      { value: 1, label: '側門' },
      { value: 2, label: '會議室' },
      { value: 3, label: '會計辦公室' },
      { value: 4, label: '大門' },
      { value: 5, label: '側門' },
      { value: 6, label: '會議室' },
      { value: 7, label: '會計辦公室' }
    ]
  }
]

enum PageModel {
  Create = 'Create',
  Update = 'Update'
}

const Device = () => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState<DeviceDataType>()
  const [deviceData, setDeviceData] = useState<DeviceDataType>()
  const [showAdvanceSetting, setShowAdvanceSetting] = useState<boolean>(false)

  const router = useRouter()
  const theme = useTheme()

  const { id } = Array.isArray(router.query) ? router.query[0] : router.query
  const pageModel = id === 'new' ? PageModel.Create : PageModel.Update

  const dynamicFormRef = useRef<DynamicFormComponent | null>(null)

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const handleSubmit = async (formData: DeviceDataType) => {
    const deviceRepData: DeviceDataType = {
      ...formData
    }

    for (const key in deviceRepData) {
      if (deviceRepData[key] === null || deviceRepData[key] === undefined || deviceRepData[key] === '') {
        delete deviceRepData[key]
      }
    }
    delete deviceRepData.confirmPassword

    if (pageModel === PageModel.Create) {
      await requestCreate(deviceRepData)
    } else {
      await requestUpdate(id, deviceRepData)
    }

    if (pageModel === PageModel.Update) {
      useSnackbar.showSnackbar('讀卡機資料更新成功', 5000)
      router.reload()
    } else {
      router.push('/cardReader/devices')
      useSnackbar.showSnackbar('讀卡機資料建立成功', 5000)
    }
  }

  const useSnackbar = useSnackbarContext()

  // * 安全性操作
  const [getConfirmation, ConfirmDialog] = useConfirm()

  const handleAccountDelete = async () => {
    const status = await getConfirmation('是否確認註銷該裝置', '刪除動作經確認後將無法撤回')

    if (status) {
      const responseData = await requestDelete(id)
      console.log(responseData)

      router.push('/cardReader/devices/')
      useSnackbar.showSnackbar(`裝置 Id(${id}) 已註銷`, 6000)
    } else {
      useSnackbar.showSnackbar('動作已取消', 6000)
    }
  }

  useEffect(() => {
    if (!id) return
    if (pageModel === PageModel.Update) {
      ;(async () => {
        const responseData = await requestGet(id)
        if (!responseData) return
        setDeviceData(responseData)
      })()
    }
  }, [id, pageModel])

  useEffect(() => {
    if (!id) return
    if (pageModel === PageModel.Update) {
      const updatedDynamicFormFields = dynamicFormFields.filter(
        field => field.name !== 'password' && field.name !== 'confirmPassword'
      )

      setFormField(updatedDynamicFormFields)

      if (!deviceData) return
      const { device_name, device_pos, device_uid, device_mode } = deviceData
      setFormData({
        device_name: device_name || '',
        device_pos: device_pos || '',
        device_uid: device_uid || '',
        device_mode: device_mode || 0
      })
    } else {
      setFormField(dynamicFormFields)

      setFormData({
        device_name: '',
        device_pos: '',
        device_uid: '',
        device_mode: 0,
        account_id: '',
        permissionType: 0,
        customizePermissions: { 0: false, 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false }
      })
    }
  }, [deviceData, id, pageModel])

  return (
    <>
      {formField && formData && (
        <>
          <StyledButton
            variant='contained'
            startIcon={<KeyboardBackspaceIcon fontSize='medium' />}
            onClick={() => router.back()}
          >
            返回
          </StyledButton>
          <Card sx={{ paddingX: 8, paddingBottom: 4 }}>
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={12} sx={{ marginBottom: 8 }}>
                  <DynamicForm
                    ref={dynamicFormRef}
                    fields={formField}
                    formData={formData}
                    handleSubmitForm={handleSubmit}
                    validationSchema={CardValidationSchema}
                    dependencies={[{ dependency: 'permissionType', method: handleWatchPermission }]}
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: 16, marginBottom: 8 }}>
                  <Stack direction={'row'}>
                    <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleChildSubmit}>
                      保存
                    </Button>
                    <Button type='reset' variant='outlined' color='secondary' onClick={handleChildRest}>
                      重置
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              {pageModel === PageModel.Update && (
                <CardActions disableSpacing sx={{ padding: 0 }}>
                  <Button
                    variant='contained'
                    color='error'
                    startIcon={<GppMaybeIcon />}
                    sx={{ borderRadius: 0, width: '100%' }}
                    onClick={() => setShowAdvanceSetting(!showAdvanceSetting)}
                  >
                    安全性設定
                  </Button>
                </CardActions>
              )}
              <Collapse
                in={showAdvanceSetting}
                timeout='auto'
                easing={'ease'}
                unmountOnExit
                sx={{ border: `solid 2px ${theme.palette.error.light}`, color: 'white' }}
              >
                <CardContent sx={{ backgroundColor: 'white' }}>
                  <Stack direction={'row'} spacing={8} justifyContent={'center'}>
                    <Button type='button' variant='contained' color='error' onClick={handleAccountDelete}>
                      註銷此裝置
                    </Button>
                  </Stack>
                </CardContent>
              </Collapse>
            </CardContent>
          </Card>
          <ConfirmDialog /> {/* TS Error */}
        </>
      )}
    </>
  )
}

export default Device
