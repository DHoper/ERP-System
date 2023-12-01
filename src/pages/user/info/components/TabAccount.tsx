// ** React Imports
import { useState, useEffect, useRef, useContext } from 'react'

import { Grid, CardContent, Button, Stack } from '@mui/material'

// ** Icons Imports
import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormType } from 'src/types/ComponentsTypes'
import { UserAccountDataType, UserAccountValidationSchema, UserDataType } from 'src/types/UserTypes'
import AuthContext, { AuthContextType } from 'src/context/Auth/AuthContext'
import { getWithExpiry } from 'src/utils/utils'
import { hexStringToBlobUrl } from 'src/utils/convert'

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



const TabAccount = ({ userData, disabled }: { userData: UserDataType; disabled: boolean }) => {
  const asciiArray = userData.head_portrait

  // function chunkToString(startIndex: number, chunkSize: number) {
  //   const endIndex = Math.min(startIndex + chunkSize, asciiArray.length)
  //   const chunk = asciiArray.slice(startIndex, endIndex)

  //   return String.fromCharCode(...chunk)
  // }

  // const chunkSize = 1000
  // let resultString = ''

  // for (let i = 0; i < asciiArray.length; i += chunkSize) {
  //   resultString += chunkToString(i, chunkSize)
  // }

  // console.log(resultString, 55)
  const hexUrl = hexStringToBlobUrl(asciiArray)

  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [avatarUrl, setAvatarUrl] = useState<string>(hexUrl)
  const [avatarHexString, setAvatarHexString] = useState<string>()

  const dynamicFormRef = useRef(null)

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const authContext = useContext<AuthContextType>(AuthContext)

  const handleSubmit = async (formData: UserAccountDataType) => {
    const token = getWithExpiry('token')
    const userUpdateData: UserAccountDataType = { ...userData, ...formData, head_portrait: avatarHexString! }
    const { update } = authContext
    await update(userUpdateData, token)
  }

  const handleAvatarChange = (url: string, hexString: string) => {
    setAvatarUrl(url)

    setAvatarHexString(hexString)
  }

  useEffect(() => {
    setFormField(dynamicFormFields)

    const { username, nickname, email, isActive, title } = userData
    setFormData({ username, nickname, email, isActive, title })
  }, [userData])

  return (
    <>
      <CardContent sx={{ backgroundColor: disabled ? '#fafafa' : null }}>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 10 }}>
            <AvatarImage avatarImgUrl={avatarUrl} onChange={handleAvatarChange} disabled={disabled} />
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
