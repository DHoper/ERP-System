// ** React Imports
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { Grid, CardContent, Button, Stack, Card, styled, Collapse, CardActions, useTheme } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'

import { generatePassword } from 'password-generator-ts'
import { generateUsername } from 'unique-username-generator'

import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormComponent, DynamicFormType } from 'src/types/ComponentsTypes'
import { requestCheckAccountName, requestCreate, requestDelete, requestGet, requestUpdate } from 'src/api/member/member'
import { MemberDataType, MemberValidationSchema } from 'src/types/MemberTypes'
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
    label: '基本資訊',
    fullWidth: true
  },

  {
    name: 'nickname',
    fieldType: 'text',
    label: '姓名',
    fullWidth: false
  },
  {
    name: 'email',
    fieldType: 'email',
    label: '信箱',
    fullWidth: false
  },
  {
    name: 'phone',
    fieldType: 'tel',
    label: '連絡電話',
    fullWidth: false
  },
  {
    name: 'divider',
    fieldType: 'divider',
    label: '詳細資訊',
    fullWidth: true
  },
  {
    name: 'title',
    fieldType: 'text',
    label: '職業',
    fullWidth: false
  },
  {
    name: 'address',
    fieldType: 'text',
    label: '住址',
    fullWidth: false
  },
  {
    name: 'languages',
    label: '語言',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 0, label: '中文' },
      { value: 1, label: '英文' },
      { value: 2, label: '泰文' }
    ]
  },
  {
    name: 'line_token',
    fieldType: 'text',
    label: 'Line Token',
    fullWidth: false
  },
  {
    name: 'member_group_id',
    fieldType: 'text',
    label: '群組ID',
    fullWidth: false
  },
  {
    name: 'birthDate',
    fieldType: 'date',
    label: '生日',
    fullWidth: false
  },
  {
    name: 'gender',
    label: '性別',
    fieldType: 'radioGroup',
    fullWidth: false,
    options: [
      { value: 0, label: '男' },
      { value: 1, label: '女' }
    ]
  },
  {
    name: 'intro',
    fieldType: 'text',
    label: '簡介',
    fullWidth: true,
    minRows: 2
  },
  {
    name: 'divider',
    fieldType: 'divider',
    label: '帳戶設定',
    fullWidth: true
  },
  {
    name: 'account',
    fieldType: 'text',
    label: '帳戶名',
    fullWidth: false
  },
  {
    name: 'role',
    label: '身分別',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 0, label: '家長' },
      { value: 1, label: '學員' }
    ]
  },
  {
    name: 'password',
    fieldType: 'password',
    label: '密碼',
    fullWidth: false
  },
  {
    name: 'confirmPassword',
    fieldType: 'password',
    label: '密碼確認',
    fullWidth: false
  },
  {
    name: 'isActive',
    label: '狀態',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 1, label: '活躍' },
      { value: 0, label: '停用' }
    ]
  }
]

enum PageModel {
  Create = 'Create',
  Update = 'Update'
}

const MemberInformation = () => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState<MemberDataType>()
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarHexString, setAvatarHexString] = useState<string>()
  const [accountName, setAccountName] = useState<string>(generateUsername())
  const [accountData, setAccountData] = useState<MemberDataType>()

  const router = useRouter()
  const theme = useTheme()

  const { id } = Array.isArray(router.query) ? router.query[0] : router.query
  const pageModel = id && id === 'new' ? PageModel.Create : PageModel.Update

  const dynamicFormRef = useRef<DynamicFormComponent | null>(null)

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const handleSubmit = async (formData: MemberDataType) => {
    let birthDate
    if (formData.birthDate) {
      birthDate = new Date(formData.birthDate)
      const year = birthDate.getFullYear()
      const month = String(birthDate.getMonth() + 1).padStart(2, '0')
      const day = String(birthDate.getDate()).padStart(2, '0')

      birthDate = `${year}-${month}-${day}`
    }

    const memberRepData: MemberDataType = {
      ...formData,
      head_portrait: avatarHexString!,
      birthDate
    }

    for (const key in memberRepData) {
      if (memberRepData[key] === null || memberRepData[key] === undefined || memberRepData[key] === '') {
        delete memberRepData[key]
      }
    }
    delete memberRepData.confirmPassword

    if (pageModel === PageModel.Create) {
      await requestCreate(memberRepData)
    } else {
      await requestUpdate(id, memberRepData)
    }

    router.push('/members')
  }

  const handleAvatarChange = (url: string, hexString: string) => {
    setAvatarUrl(url)
    setAvatarHexString(hexString)
  }

  // * 安全性操作
  const [showAdvanceSetting, setShowAdvanceSetting] = useState<boolean>(false)
  const [getConfirmation, WarningConfirmDialog] = useConfirm()

  const useSnackbar = useSnackbarContext()

  const handleAccountDelete = async () => {
    const status = await getConfirmation('是否確認註銷該用戶', '刪除動作經確認後將無法撤回')

    if (status) {
      await requestDelete(id)

      router.push('/members')
      useSnackbar.showSnackbar(`用戶 Id(${id}) 已註銷`, 6000)
    } else {
      useSnackbar.showSnackbar('動作已取消', 6000)
    }
  }

  const handlePasswordReset = async () => {
    const status = await getConfirmation('是否確認註銷該用戶', '刪除動作經確認後將無法撤回')
    if (status) {
      const newRandomPassword = generatePassword(8, {
        lowercases: true,
        uppercases: true,
        symbols: false,
        numbers: true
      })
      try {
        await requestUpdate(id, { password: newRandomPassword })

        useSnackbar.showSnackbar(`密碼重設成功，新密碼為: ${newRandomPassword}`, null)
      } catch (error) {
        console.error('執行 requestUpdate 時發生錯誤:', error)
      }
    } else {
      useSnackbar.showSnackbar('動作已取消', 6000)
    }
  }

  useEffect(() => {
    const checkAndSetAccountName = async () => {
      try {
        const isLegal = requestCheckAccountName(accountName)
        if (!isLegal) {
          setAccountName(generateUsername())
        }
      } catch (error) {
        console.error('執行 requestCheckAccountName 時發生錯誤:', error)
      }
    }

    checkAndSetAccountName()
  }, [accountName])

  useEffect(() => {
    if (!id) return
    if (pageModel === PageModel.Update) {
      ;(async () => {
        const responseData = await requestGet(id)
        if (!responseData) return
        setAccountData(responseData)
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

      // const responseData = aa[4]  // fakeData
      if (!accountData) return
      const {
        head_portrait,
        account,
        nickname,
        email,
        phone,
        address,
        title,
        gender,
        birthDate,
        intro,
        languages,
        line_token,
        member_group_id,
        isActive,
        role
      } = accountData
      setFormData({
        head_portrait: head_portrait || '',
        account: account || '',
        nickname: nickname || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        title: title || '',
        gender: gender || 0,
        birthDate: birthDate,
        intro: intro || '',
        languages: languages || 0,
        line_token: line_token || '',
        member_group_id: member_group_id || '',
        isActive: isActive || 0,
        role: role || 0
      })
    } else {
      setFormField(dynamicFormFields)

      setFormData({
        head_portrait: '',
        account: accountName || '',
        nickname: '',
        password: generatePassword(8, {
          lowercases: true,
          uppercases: true,
          symbols: false,
          numbers: true
        }),
        email: '',
        phone: '',
        address: '',
        title: '',
        gender: 0,
        birthDate: '',
        intro: '',
        languages: 0,
        line_token: '',
        member_group_id: '',
        isActive: 1,
        role: 0
      })
    }
  }, [accountData, accountName, id, pageModel])

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
          <Card sx={{ padding: 8, paddingBottom: 0 }}>
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 10 }}>
                  <AvatarImage
                    sx={{ justifyContent: 'center' }}
                    direction='column'
                    avatarImgUrl={avatarUrl ? avatarUrl : ''}
                    onChange={handleAvatarChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
                  <DynamicForm
                    ref={dynamicFormRef}
                    fields={formField}
                    formData={formData}
                    handleSubmitForm={handleSubmit}
                    validationSchema={MemberValidationSchema}
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: 16, marginBottom: 2 }}>
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
            </CardContent>
          </Card>
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
            <CardContent>
              <Stack direction={'row'} spacing={8} justifyContent={'center'}>
                <Button type='button' variant='outlined' color='error' onClick={handlePasswordReset}>
                  重設密碼
                </Button>
                <Button type='button' variant='contained' color='error' onClick={handleAccountDelete}>
                  註銷此帳戶
                </Button>
              </Stack>
            </CardContent>
          </Collapse>
          <WarningConfirmDialog />
        </>
      )}
    </>
  )
}

export default MemberInformation
