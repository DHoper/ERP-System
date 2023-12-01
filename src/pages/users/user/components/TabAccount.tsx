// ** React Imports
import { useState, useEffect, useRef, useContext } from 'react'

import { Grid, CardContent, Button, Stack } from '@mui/material'

// ** Icons Imports
import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormType } from 'src/types/ComponentsTypes'
import { UserAccountType, UserAccountValidationSchema, UserType } from 'src/types/UserTypes'
import AuthContext, { AuthContextType } from 'src/context/Auth/AuthContext'
import { getWithExpiry } from 'src/utils/utils'
import { hexStringToBlobUrl } from 'src/utils/convert'
import { requestUpdate } from 'src/api/user/user'

const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'username',
    fieldType: 'text',
    label: '暱稱',
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
    name: 'isActive',
    label: '狀態',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 1, label: '活躍' },
      { value: 0, label: '停用' }
    ]
  },
  {
    name: 'title',
    fieldType: 'text',
    label: '職稱',
    fullWidth: false
  }
]

const TabAccount = ({
  formData: { account_id, username, nickname, email, isActive, title, head_portrait },
  disabled
}: {
  formData: UserAccountType
  disabled: boolean
}) => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const [avatarHexString, setAvatarHexString] = useState<string>()

  const dynamicFormRef = useRef(null)

  if (head_portrait) {
    const hexUrl = hexStringToBlobUrl(head_portrait)
    setAvatarUrl(hexUrl)
  }

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const handleSubmit = async (formData: UserAccountType) => {
    const userUpdateData: UserAccountType = { ...formData, head_portrait: avatarHexString ? avatarHexString : null }

    try {
      await requestUpdate(account_id!, userUpdateData)
    } catch (error) {
      console.error('執行 User requestUpdate 時發生錯誤:', error)
    }
  }

  const handleAvatarChange = (url: string, hexString: string) => {
    setAvatarUrl(url)

    setAvatarHexString(hexString)
  }

  useEffect(() => {
    setFormField(dynamicFormFields)

    setFormData({
      username: username || '',
      nickname: nickname || '',
      email: email || '',
      isActive: isActive || '',
      title: title || ''
    })
  }, [email, isActive, nickname, title, username])

  return (
    <>
      <CardContent sx={{ backgroundColor: disabled ? '#fafafa' : null }}>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 10 }}>
            <AvatarImage avatarImgUrl={avatarUrl ? avatarUrl : ''} onChange={handleAvatarChange} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
            {formField && (
              <DynamicForm
                ref={dynamicFormRef}
                fields={formField}
                formData={formData}
                handleSubmitForm={handleSubmit}
                validationSchema={UserAccountValidationSchema}
                disabled={disabled}
              />
            )}
          </Grid>

          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 2 }}>
            <Stack direction={'row'}>
              <Button variant='contained' disabled={disabled} sx={{ marginRight: 3.5 }} onClick={handleChildSubmit}>
                保存
              </Button>
              <Button type='reset' disabled={disabled} variant='outlined' color='secondary' onClick={handleChildRest}>
                重置
              </Button>
              <Button
                type='button'
                disabled={disabled}
                variant='contained'
                color='error'
                sx={{ marginLeft: 'auto', display: 'block' }}
              >
                註銷此帳戶
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}

export default TabAccount
