// ** React Imports
import { useContext, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DynamicForm from 'src/views/form/DynamicForm'
import { DynamicFormComponent, DynamicFormType } from 'src/types/ComponentsTypes'
import { GetUserSecurityValidationSchema, UserSecurityType } from 'src/types/UserTypes'
import { Stack } from '@mui/system'
import AuthContext, { AuthContextType } from 'src/context/Auth/AuthContext'
import { useSnackbarContext } from 'src/context/SnackbarContext'
import { useRouter } from 'next/router'

const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'currentPassword',
    fieldType: 'password',
    label: '目前密碼',
    fullWidth: true
  },
  {
    name: 'password',
    fieldType: 'password',
    label: '新密碼',
    fullWidth: false
  },
  {
    name: 'confirmPassword',
    fieldType: 'password',
    label: '確認新密碼',
    fullWidth: false
  }
]

const TabSecurity = () => {
  const formField: DynamicFormType[] = dynamicFormFields
  const formData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

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

  const authContext = useContext<AuthContextType>(AuthContext)
  const { accountId, update } = authContext

  const handleSubmit = async (formData: UserSecurityType) => {
    const { password } = formData
    if (!accountId) return
    try {
      await update({ account_id: accountId, password })
      useSnackbar.showSnackbar('密碼已更新成功', 5000)
      router.reload()
    } catch (error) {
      console.error('執行 User requestUpdate 時發生錯誤:', error)
    }
  }

  const UserSecurityValidationSchema = GetUserSecurityValidationSchema() // * 待優化 --在Yup中使context?

  return (
    <>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} xl={6} sx={{ marginTop: 4.8, marginBottom: 8 }}>
            <DynamicForm
              ref={dynamicFormRef}
              fields={formField}
              formData={formData}
              handleSubmitForm={handleSubmit}
              validationSchema={UserSecurityValidationSchema}
            ></DynamicForm>
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
    </>
  )
}
export default TabSecurity
