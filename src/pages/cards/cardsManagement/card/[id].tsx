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
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Alert,
  Container,
  Box,
  CircularProgress,
  Fab
} from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckIcon from '@mui/icons-material/Check'
import CreditCardIcon from '@mui/icons-material/CreditCard'

import DynamicForm from 'src/views/form/DynamicForm'
import { DynamicFormComponent, DynamicFormType } from 'src/types/ComponentsTypes'
import { requestCreate, requestDelete, requestGet, requestGetAll, requestUpdate } from 'src/api/cardReader/device'
import { DeviceDataType } from 'src/types/CardReaderTypes'
import useConfirm from 'src/views/message/WarningConfirmDialog'
import { useSnackbarContext } from 'src/context/SnackbarContext'
import { UseFormReturn } from 'react-hook-form'
import { CardValidationSchema } from 'src/types/CardTypes'
import { green } from '@mui/material/colors'

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

  Object.keys(customizePermissions).forEach(permission => {
    setValue(`customizePermissions[${permission}]`, watchedField ? true : false, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  })

  dynamicFormFields.forEach(field => {
    if (field.name === 'customizePermissions') {
      field.disabled = watchedField !== 99 ? true : false
    }
  })
}

const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'divider',
    fieldType: 'divider',
    label: '卡片資訊',
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
        color: '#9C9FA4'
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
  const [deviceNameDataset, setDeviceNameDataset] = useState<string[]>([])
  const [showAdvanceSetting, setShowAdvanceSetting] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)

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

  // * 掃描卡片(step-2)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const timer = useRef<number>()

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700]
      }
    })
  }

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false)
      setLoading(true)
      timer.current = window.setTimeout(() => {
        setSuccess(true)
        setLoading(false)
      }, 2000)
    }
  }

  // * 安全性操作
  const [getConfirmation, ConfirmDialog] = useConfirm()

  const useSnackbar = useSnackbarContext()

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

  useEffect(() => {
    ;(async () => {
      try {
        const responseData = await requestGetAll()
        const dataCarrier = []
        for (const data of responseData) {
          dataCarrier.push(data.device_name)
        }
        setDeviceNameDataset(dataCarrier)
      } catch (error) {
        console.error('執行 Device requestGetAll 時發生錯誤:', error)
      }
    })()
  }, [deviceNameDataset])

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
              <Stepper activeStep={activeStep} alternativeLabel sx={{ marginTop: 16, marginBottom: 8 }}>
                <Step key={0}>
                  <StepLabel>選擇讀卡機</StepLabel>
                </Step>
                <Step key={1}>
                  <StepLabel>掃描卡片</StepLabel>
                </Step>
                <Step key={2}>
                  <StepLabel>確認卡片資料</StepLabel>
                </Step>
              </Stepper>

              {activeStep === 0 && (
                <Grid container spacing={0}>
                  <CardContent sx={{ minWidth: '80%', marginX: 'auto' }}>
                    <Paper elevation={1} sx={{ backgroundColor: '#E5F6FD' }}>
                      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                        <ErrorOutlineIcon sx={{ color: '#014361' }} />
                        <Typography sx={{ marginY: 8, fontWeight: 600, color: '#014361' }}>
                          選擇欲操作之讀卡機，以進行掃描
                        </Typography>
                      </Stack>
                    </Paper>

                    <Autocomplete
                      sx={{ marginTop: 8 }}
                      disablePortal
                      id='card-device-combo-box'
                      options={deviceNameDataset}
                      renderInput={params => <TextField {...params} label='讀卡機名稱' />}
                    />
                  </CardContent>
                  <Grid item xs={12} sx={{ marginTop: 16, marginBottom: 8 }}>
                    <Stack direction={'row'} justifyContent={'end'}>
                      <Button variant='contained' sx={{ marginRight: 4 }} onClick={() => setActiveStep(prev => ++prev)}>
                        下一步
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Grid container spacing={0}>
                  <Grid item xs={12} sx={{ marginBottom: 8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ m: 1, position: 'relative' }}>
                        <Fab aria-label='save' color='primary' sx={buttonSx} onClick={handleButtonClick}>
                          {success ? <CheckIcon /> : <CreditCardIcon />}
                        </Fab>
                        {loading && (
                          <CircularProgress
                            size={68}
                            sx={{
                              color: green[500],
                              position: 'absolute',
                              top: -6,
                              left: -6,
                              zIndex: 1
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ m: 1, position: 'relative' }}>
                        <Button variant='contained' sx={buttonSx} disabled={loading} onClick={handleButtonClick}>
                          開始掃描卡片
                        </Button>
                        {loading && (
                          <CircularProgress
                            size={24}
                            sx={{
                              color: green[500],
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              marginTop: '-12px',
                              marginLeft: '-12px'
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
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
                    <Stack direction={'row'} justifyContent={'end'}>
                      <Button variant='contained' sx={{ marginRight: 4 }} onClick={handleChildSubmit}>
                        保存
                      </Button>
                      <Button type='reset' variant='outlined' color='secondary' onClick={handleChildRest}>
                        重置
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              )}

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
