// ** React Imports
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { Grid, CardContent, Button, Stack, Card, styled } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

import { generatePassword, IPasswordConfig } from 'password-generator-ts'
import { generateUsername } from 'unique-username-generator'

import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormType } from 'src/types/ComponentsTypes'
import { requestCreate, requestGet } from 'src/api/member/member'
import { MemberDataType, MemberValidationSchema } from 'src/types/MemberType'

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

const length = 8

const config: IPasswordConfig = {
  lowercases: true,
  uppercases: true,
  symbols: false,
  numbers: true
}

const MemberInformation = () => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState<MemberDataType>({
    head_portrait: '',
    account: generateUsername(),
    nickname: '',
    password: generatePassword(length, config),
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
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarHexString, setAvatarHexString] = useState<string>()

  const router = useRouter()
  const { id } = Array.isArray(router.query) ? router.query[0] : router.query

  const dynamicFormRef = useRef(null)

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

    const userUpdateData: MemberDataType = {
      ...formData,
      head_portrait: avatarHexString!,
      birthDate
    }
    await requestCreate(userUpdateData)
  }

  const handleAvatarChange = (url: string, hexString: string) => {
    setAvatarUrl(url)
    setAvatarHexString(hexString)
  }

  useEffect(() => {
    setFormField(dynamicFormFields)

    if (!id) return
    if (id !== 'new') {
      ;(async () => {
        const responseData = await requestGet(id)
        const {
          head_portrait,
          account,
          nickname,
          password,
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
        } = responseData
        setFormData({
          head_portrait,
          account,
          nickname,
          password,
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
        })
      })()
    }
  }, [id])

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
                  validationSchema={MemberValidationSchema}
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
