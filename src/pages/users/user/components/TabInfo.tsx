// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import { DynamicFormComponent, DynamicFormType } from 'src/types/ComponentsTypes'
import { UserIntersectionType, UserInfoType, UserInfoValidationSchema } from 'src/types/UserTypes'
import DynamicForm from 'src/views/form/DynamicForm'
import { Stack } from '@mui/system'
import { requestUpdate } from 'src/api/user/user'
import { useAuthContext } from 'src/context/Auth/AuthContext'
import { useSnackbarContext } from 'src/context/SnackbarContext'
import { useRouter } from 'next/router'

const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'intro',
    fieldType: 'text',
    label: '簡介',
    fullWidth: true,
    minRows: 2
  },
  {
    name: 'address',
    fieldType: 'text',
    label: '住址',
    fullWidth: false
  },
  {
    name: 'phone',
    fieldType: 'text',
    label: '連絡電話',
    fullWidth: false
  },
  {
    name: 'line_token',
    fieldType: 'text',
    label: 'Line Token',
    fullWidth: false
  },
  {
    name: 'birthDate',
    fieldType: 'date',
    label: '生日',
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
    name: 'gender',
    label: '性別',
    fieldType: 'radioGroup',
    fullWidth: false,
    options: [
      { value: 0, label: '男' },
      { value: 1, label: '女' }
    ]
  }
]

const TabInfo = ({ userData, pageModel }: { userData: UserIntersectionType; pageModel: 'Admin' | 'User' }) => {
  // ** State
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [id, setId] = useState<string>()

  const router = useRouter()
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

  const handleSubmit = async (formData: UserInfoType) => {
    let birthDate
    if (formData.birthDate) {
      birthDate = new Date(formData.birthDate)
      const year = birthDate.getFullYear()
      const month = String(birthDate.getMonth() + 1).padStart(2, '0')
      const day = String(birthDate.getDate()).padStart(2, '0')

      birthDate = `${year}-${month}-${day}`
    }
    const userUpdateData: UserInfoType = { ...formData, birthDate }

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

  useEffect(() => {
    setFormField(dynamicFormFields)
    const { account_id, intro, birthDate, phone, address, line_token, languages, gender } = userData

    setId(account_id)

    setFormData({
      intro: intro || '',
      birthDate: birthDate || '',
      phone: phone || '',
      address: address || '',
      line_token: line_token || '',
      languages: languages || 0,
      gender: gender || 0
    })
  }, [userData])

  return (
    <>
      {formField && (
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
              <DynamicForm
                ref={dynamicFormRef}
                fields={formField}
                formData={formData}
                handleSubmitForm={handleSubmit}
                validationSchema={UserInfoValidationSchema}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 2 }}>
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
      )}
    </>
  )
}

export default TabInfo
