// ** React Imports
import { useState, useEffect, useRef, useContext } from 'react'

import { Grid, CardContent, Button, Stack, Card, styled } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

// ** Icons Imports
import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormType } from 'src/types/ComponentsTypes'
import { UserAccountDataType, UserAccountVaildationSchema, UserDataType } from 'src/types/UserType'
import AuthContext, { AuthContextType } from 'src/context/user/user'
import { useRouter } from 'next/router'

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
    fieldType: 'text',
    label: '信箱',
    fullWidth: false
  },
  {
    name: 'phone',
    fieldType: 'text',
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
    name: 'country',
    label: '國籍',
    fieldType: 'text',
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
    name: 'lineToken',
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
    name: 'membername',
    fieldType: 'text',
    label: '暱稱',
    fullWidth: false
  },
  {
    name: 'password',
    fieldType: 'password',
    label: '密碼',
    fullWidth: false
  },
  {
    name: 'role',
    label: '權限',
    fieldType: 'select',
    fullWidth: false,
    options: [
      { value: 0, label: '家長' },
      { value: 1, label: '學員' }
    ]
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

const MemberInformation = () => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarBlob, setAvatarBlob] = useState<Blob>()

  const router = useRouter()
  const { id } = router.query

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
    const userUpdateData: UserAccountDataType = { ...userData, ...formData, head_portrait: avatarBlob! }
    console.log(userUpdateData, avatarBlob, 77)
    const { update } = authContext
    // await update(userData.member_id, userUpdateData)
  }

  const handleAvatarChange = (url: string, blob: Blob) => {
    setAvatarUrl(url)
    setAvatarBlob(blob)
  }

  useEffect(() => {
    setFormField(dynamicFormFields)

    // const { username, nickname, email, isActive, title } = userData
    // setFormData({ username, nickname, email, isActive, title })
    setFormData(userData)
  }, [])

  return (
    <>
      <StyledButton
        variant='contained'
        startIcon={<KeyboardBackspaceIcon fontSize='medium' />}
        onClick={() => router.back()}
      >
        返回
      </StyledButton>
      <Card sx={{ padding: 16, paddingBottom: 8 }}>
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 10 }}>
              <AvatarImage
                sx={{ justifyContent: 'center' }}
                direction='column'
                avatarImgUrl={avatarUrl}
                onChange={handleAvatarChange}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
              {formField && (
                <DynamicForm
                  ref={dynamicFormRef}
                  fields={formField}
                  formData={formData}
                  handleSubmitForm={handleSubmit}
                  vaildationSchema={UserAccountVaildationSchema}
                />
              )}
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 2 }}>
              <Stack direction={'row'}>
                <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleChildSubmit}>
                  保存
                </Button>
                <Button type='reset' variant='outlined' color='secondary' onClick={handleChildRest}>
                  重置
                </Button>
                <Button type='button' variant='contained' color='error' sx={{ marginLeft: 'auto', display: 'block' }}>
                  註銷此帳戶
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default MemberInformation

const userData = {
  avatarImgUrl: 'https://example.com/avatar1.jpg',
  membername: 'user1',
  nickname: 'John Doe',
  password: 'password1',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  address: '123 Main St, Cityville',
  title: 'Software Engineer',
  gender: 0,
  role: 1,
  birthDate: '1990-01-01',
  intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  country: 'United States',
  languages: 1,
  lineToken: 'line-token-1',
  isActive: 1,
  member_group_id: 24145554,
  createdAt: '2022-01-01T12:00:00Z',
  updatedAt: '2022-11-23T08:30:00Z'
}
