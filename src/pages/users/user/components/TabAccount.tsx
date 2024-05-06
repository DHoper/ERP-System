// ** React Imports
import { useState, useEffect, useRef } from 'react'

import { Grid, CardContent, Button, Stack, CardActions, Collapse } from '@mui/material'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'

// ** Icons Imports
import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormComponent, DynamicFormType } from 'src/types/ComponentsTypes'
import { UserAccountType, UserAccountValidationSchema, UserIntersectionType } from 'src/types/UserTypes'
import { useAuthContext } from 'src/context/Auth/AuthContext'
import { hexStringToBlobUrl } from 'src/utils/convert'
import { requestDelete, requestUpdate } from 'src/api/user/user'
import { useSnackbarContext } from 'src/context/SnackbarContext'
import { useTheme } from '@emotion/react'
import useConfirm from 'src/views/message/WarningConfirmDialog'
import { useRouter } from 'next/router'
import { generatePassword } from 'password-generator-ts'

const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'username',
    fieldType: 'text',
    label: '帳戶名稱',
    fullWidth: false
  },
  {
    name: 'nickname',
    fieldType: 'text',
    label: '姓名',
    fullWidth: false
  },
  {
    name: 'email',
    fieldType: 'text',
    label: '信箱',
    fullWidth: false
  },
  {
    name: 'group_id',
    label: '部門',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 0, label: '資訊部' },
      { value: 1, label: '人事部' },
      { value: 2, label: '工程部' }
    ]
  },
  {
    name: 'title',
    fieldType: 'text',
    label: '職稱',
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

const TabAccount = ({
  userData,
  pageModel,
  disabled
}: {
  userData: UserIntersectionType
  pageModel: 'Admin' | 'User'
  disabled: boolean
}) => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const [avatarHexString, setAvatarHexString] = useState<string>()
  const [id, setId] = useState<string>()

  const router = useRouter()
  const theme = useTheme()
  const useSnackbar = useSnackbarContext()

  const dynamicFormRef = useRef<DynamicFormComponent | null>(null)

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const useAuth = useAuthContext()
  const { update } = useAuth
  const handleSubmit = async (formData: UserAccountType) => {
    const userUpdateData: UserAccountType = { ...formData, head_portrait: avatarHexString ? avatarHexString : null }

    try {
      if (pageModel === 'Admin') {
        await requestUpdate(id!, userUpdateData)
      } else {
        await update(userUpdateData)
      }
      useSnackbar.showSnackbar('帳戶資料已更新成功', 5000)
      router.reload()
    } catch (error) {
      console.error('執行 User requestUpdate 時發生錯誤:', error)
    }
  }

  const handleAvatarChange = (url: string, hexString: string) => {
    setAvatarUrl(url)

    setAvatarHexString(hexString)
  }

  // * 安全性操作
  const [showAdvanceSetting, setShowAdvanceSetting] = useState<boolean>(false)
  const [getConfirmation, ConfirmDialog] = useConfirm()

  const handleAccountDelete = async () => {
    const status = await getConfirmation('是否確認註銷該用戶', '刪除動作經確認後將無法撤回')

    if (status && id) {
      await requestDelete(id)

      router.push('/users')
      useSnackbar.showSnackbar(`用戶 Id(${id}) 已註銷`, 5000)
    } else {
      useSnackbar.showSnackbar('動作已取消', 5000)
    }
  }

  const handlePasswordReset = async () => {
    if (!id) return
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
      useSnackbar.showSnackbar('動作已取消', 5000)
    }
  }

  useEffect(() => {
    if (pageModel === 'Admin') {
      dynamicFormFields.push({
        name: 'role',
        label: '權限',
        fieldType: 'select',
        fullWidth: false,
        options: [
          { value: 0, label: '一般員工' },
          { value: 1, label: '管理員' }
        ]
      })
    }
    setFormField(dynamicFormFields)
  }, [pageModel])

  useEffect(() => {
    if (!('username' in userData)) return
    const { account_id, username, nickname, email, isActive, group_id, title, role, head_portrait } =
      userData as UserAccountType //* TS ERROR

    setId(account_id)

    if (head_portrait) {
      setAvatarHexString(head_portrait)
      const hexUrl = hexStringToBlobUrl(head_portrait)
      setAvatarUrl(hexUrl)
    } else {
      setAvatarUrl('')
    }

    setFormData({
      username: username || '',
      nickname: nickname || '',
      email: email || '',
      isActive: isActive || '',
      group_id: group_id || 0,
      title: title || '',
      ...(pageModel === 'Admin' && { role: role || 0 })
    })
  }, [pageModel, userData])

  return (
    <>
      {formField && (
        <>
          <CardContent sx={{ backgroundColor: disabled ? '#fafafa' : null }}>
            <Grid container spacing={0}>
              {avatarUrl !== undefined && (
                <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 10 }}>
                  <AvatarImage avatarImgUrl={avatarUrl} onChange={handleAvatarChange} disabled={disabled} />
                </Grid>
              )}

              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
                <DynamicForm
                  ref={dynamicFormRef}
                  fields={formField}
                  formData={formData}
                  handleSubmitForm={handleSubmit}
                  validationSchema={UserAccountValidationSchema}
                  disabledAll={disabled}
                />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
                <Stack direction={'row'}>
                  <Button variant='contained' disabled={disabled} sx={{ marginRight: 3.5 }} onClick={handleChildSubmit}>
                    保存
                  </Button>
                  <Button
                    type='reset'
                    disabled={disabled}
                    variant='outlined'
                    color='secondary'
                    onClick={handleChildRest}
                  >
                    重置
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            {pageModel === 'Admin' && (
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
          </CardContent>
          <ConfirmDialog /> {/* TS Error */}
        </>
      )}
    </>
  )
}

export default TabAccount
