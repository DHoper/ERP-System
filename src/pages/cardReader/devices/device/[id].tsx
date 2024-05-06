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
  IconButton
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

const StyledButton = styled(Button)({
  backgroundColor: 'white',
  color: '#9155FD',
  marginBottom: '1rem',
  '&:hover': {
    backgroundColor: '#9155FD',
    color: 'white'
  }
})

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
    name: 'device_uid',
    fieldType: 'text',
    label: '裝置UID',
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
        device_mode: 0
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
                    validationSchema={DeviceValidationSchema}
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
