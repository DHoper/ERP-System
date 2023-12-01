// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import { DynamicFormType } from 'src/types/ComponentsTypes'
import { UserDataType, UserInfoDataType, UserInfoValidationSchema } from 'src/types/UserTypes'
import DynamicForm from 'src/views/form/DynamicForm'
import { Stack } from '@mui/system'

const dynamicFormFields: DynamicFormType[] = [
  {
    name: 'intro',
    fieldType: 'text',
    label: '簡介',
    fullWidth: true,
    minRows: 2
  },
  {
    name: 'birthDate',
    fieldType: 'date',
    label: '生日',
    fullWidth: false
  },
  {
    name: 'phone',
    fieldType: 'text',
    label: '連絡電話',
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
    name: 'gender',
    label: '性別',
    fieldType: 'radioGroup',
    fullWidth: false,
    options: [
      { value: 0, label: '男' },
      { value: 1, label: '女' },
    ]
  }
]

const TabInfo = ({ userData }: { userData: UserDataType }) => {
  // ** State
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})

  const handleChange = (fieldName: string, value: any) => {
    const formDataCarrier = { ...formData, [fieldName]: value }
    setFormData(formDataCarrier)
  }

  const dynamicFormRef = useRef(null)

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const handleChildRest = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.resetForm()
  }

  const handleSubmit = async (formData: UserInfoDataType) => {
    console.log(formData, 1250)
  }

  useEffect(() => {
    setFormField(dynamicFormFields)
    const { intro, birthDate, phone, address, country, languages, gender } = userData
    setFormData({ intro, birthDate, phone, address, country, languages, gender })
  }, [userData])

  // useEffect(() => {
  //   console.log(formData)
  // }, [formData])

  return (
    <div>
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
            {formField && (
              <DynamicForm
                ref={dynamicFormRef}
                fields={formField}
                formData={formData}
                handleSubmitForm={handleSubmit}
                validationSchema={UserInfoValidationSchema}
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
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </div>
  )
}

export default TabInfo
