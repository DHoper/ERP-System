// ** React Imports
import { useState, useEffect, useRef } from 'react'

import { Grid, CardContent, Button, Stack } from '@mui/material'

// ** Icons Imports
import DynamicForm from 'src/views/form/DynamicForm'
import AvatarImage from 'src/views/form/fieldElements/AvatarImage'
import { DynamicFormType } from 'src/types/ComponentsTypes'
import { UserAccountDataType, UserAccountVaildationSchema, UserDataType } from 'src/types/UserType'

function createDynamicFormField(userData: UserDataType): DynamicFormType[] {
  const dynamicFormFields: DynamicFormType[] = [
    {
      name: 'username',
      fieldType: 'text',
      label: '暱稱',
      fullWidth: false,
    },
    {
      name: 'name',
      fieldType: 'text',
      label: '姓名',
      fullWidth: false,
    },
    {
      name: 'email',
      fieldType: 'text',
      label: '信箱',
      fullWidth: false,
    },
    {
      name: 'department',
      fieldType: 'select',
      label: '所屬部門',
      fullWidth: false,
      options: [
        { value: 1, label: '資訊部' },
        { value: 2, label: '管理部' },
        { value: 3, label: '人事部' },
        { value: 4, label: '工程部' },
        { value: 5, label: '外勤部' }
      ],
    },
    {
      name: 'isActive',
      label: '狀態',
      fieldType: 'select',
      fullWidth: false,
      options: [
        { value: true, label: '活躍' },
        { value: false, label: '停用' }
      ],
    },
    {
      name: 'jobTitle',
      fieldType: 'text',
      label: '職稱',
      fullWidth: false,
    }
  ]

  return dynamicFormFields
}

const TabAccount = ({ userData, disabled }: { userData: UserDataType; disabled: boolean }) => {
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [avatarImgUrl, setAvatarImgUrl] = useState<string>(userData.avatarImgUrl)

  const dynamicFormRef = useRef(null)

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const handleChange = (fieldName: string, value: any) => {
    const formDataCarrier = { ...formData, [fieldName]: value }
    setFormData(formDataCarrier)
  }

  const handleSubmit = async (formData: UserAccountDataType) => {
    console.log(formData, 77)
  }

  useEffect(() => {
    setFormField(createDynamicFormField(userData))
    const { username, name, email, department, isActive, jobTitle } = userData
    setFormData({ username, name, email, department, isActive, jobTitle })
  }, [userData])

  return (
    <>
      <CardContent sx={{ backgroundColor: disabled ? '#fafafa' : null }}>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 10 }}>
            <AvatarImage avatarImgUrl={avatarImgUrl} onChange={handleChange} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
            {formField && (
              <DynamicForm
                ref={dynamicFormRef}
                fields={formField}
                formData={formData}
                handleSubmitForm={handleSubmit}
                vaildationSchema={UserAccountVaildationSchema}
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
