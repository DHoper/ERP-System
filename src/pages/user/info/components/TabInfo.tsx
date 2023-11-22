// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import { DynamicFormType } from 'src/types/ComponentsTypes'
import UserDataType from 'src/types/UserType'
import DynamicForm from 'src/views/form/DynamicForm'

function createDynamicFormField(userData: UserDataType): DynamicFormType[] {
  const dynamicFormFields: DynamicFormType[] = [
    {
      name: 'intro',
      fieldType: 'text',
      label: '簡介',
      fullWidth: true,
      value: userData.intro,
      minRows: 2
    },
    {
      name: 'birthDate',
      fieldType: 'date',
      label: '生日',
      fullWidth: false,
      value: userData.birthDate
    },
    {
      name: 'phone',
      fieldType: 'text',
      label: '連絡電話',
      fullWidth: false,
      value: userData.phone
    },
    {
      name: 'jobTitle',
      fieldType: 'text',
      label: '職稱',
      fullWidth: false,
      value: userData.jobTitle
    },
    {
      name: 'country',
      label: '國籍',
      fieldType: 'text',
      fullWidth: false,
      value: userData.country
    },
    {
      name: 'languages',
      label: '語言',
      fieldType: 'multipleSelect',
      fullWidth: false,
      options: [
        { value: 1, label: '中文' },
        { value: 2, label: '英文' },
        { value: 3, label: '泰文' }
      ],
      value: userData.languages
    },
    {
      name: 'gender',
      label: '性別',
      fieldType: 'radioGroup',
      fullWidth: false,
      options: [
        { value: 1, label: '男' },
        { value: 2, label: '女' },
        { value: 3, label: '其他' }
      ],
      value: userData.gender
    }
  ]

  return dynamicFormFields
}

const TabInfo = ({ userData }: { userData: UserDataType }) => {
  // ** State
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})

  const handleChange = (fieldName: string, value: any) => {
    const formDataCarrier = { ...formData, [fieldName]: value }
    setFormData(formDataCarrier)
  }

  useEffect(() => {
    setFormField(createDynamicFormField(userData))
    const { intro, birthDate, phone, jobTitle, country, languages, gender } = userData
    setFormData({ intro, birthDate, phone, jobTitle, country, languages, gender })
  }, [userData])

  useEffect(() => {
    console.log(formData)
  }, [formData])

  return (
    <div>
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 8 }}>
            {formField && <DynamicForm fields={formField} onChange={handleChange} formData={formData} />}
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              保存
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              取消
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </div>
  )
}

export default TabInfo