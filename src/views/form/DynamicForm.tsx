import {
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Select,
  Switch,
  MenuItem,
  TextField,
  InputLabel,
  styled,
  SelectChangeEvent
} from '@mui/material'
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { DynamicFormType } from '../../types/ComponentsTypes'
import PhoneInput from './fieldElements/PhoneInput'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ObjectSchema } from 'yup'
import { UserDataType } from 'src/types/UserType'

interface DynamicFormProps {
  fields: DynamicFormType[]
  vaildationSchema: ObjectSchema<any>
  formData: Record<string, any>
  handleSubmitForm: (formData: UserDataType) => Promise<void>
  disabled?: boolean
}

const DynamicForm = forwardRef<any, DynamicFormProps>(
  ({ fields, vaildationSchema, formData, handleSubmitForm, disabled = false }, ref) => {
    const [date, setDate] = useState<Date | null | undefined>(null)

    // ** 驗證
    const formOptions = {
      resolver: yupResolver(vaildationSchema),
      defaultValues: formData || null
    } //! react-form-hook 提供動態異步 defaultValues 設置 !
    const { register, handleSubmit, reset, trigger, formState } = useForm(formOptions)
    const { errors } = formState

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        handleSubmit(handleSubmitForm)()
      },
      resetForm: () => {
        reset()
      }
    }))

    const handleFieldChange = (fieldName: string, value: any) => {
      onChange(fieldName, value)
    }
    const formElements: React.ReactNode[] = []

    fields.map((field: DynamicFormType, index: number) => {
      let element: React.ReactNode

      switch (field.fieldType) {
        case 'text':
        case 'password':
          element = (
            <TextField
              {...register(field.name)}
              onBlur={() => trigger(field.name)}
              label={field.label}
              type={field.fieldType}
              variant='outlined'
              sx={{ ...field.sx }}
              minRows={field.minRows}
              multiline={!!field.minRows}
              disabled={disabled}
              fullWidth
            />
          )
          break

        /*   case 'phone':
        element = (
          <PhoneInput
            value={formData[field.name]}
            disabled={disabled}
          />
        )
        break */
        case 'date':
          const CustomInput = forwardRef((props, ref) => {
            return <TextField inputRef={ref} label={field.label} fullWidth {...props} />
          })

          element = (
            <DatePickerWrapper>
              <DatePicker
                {...register(field.name)}
                onBlur={() => trigger(field.name)}
                selected={new Date(formData[field.name])}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                disabled={disabled}
                onChange={date => {
                  handleFieldChange(field.name, date)
                }}
              />
            </DatePickerWrapper>
          )
          break

        case 'select':
          element = (
            <FormControl fullWidth variant='outlined'>
              <InputLabel>{field.label}</InputLabel>
              <Select
                {...register(field.name)}
                onBlur={() => trigger(field.name)}
                label={field.label}
                disabled={disabled}
                defaultValue={formOptions.defaultValues ? formOptions.defaultValues[field.name] : 1}
                fullWidth
              >
                {field.options?.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
          break
        case 'multipleSelect':
          element = (
            <FormControl fullWidth variant='outlined'>
              <InputLabel>{field.label}</InputLabel>
              <Select
                {...register(field.name)}
                onBlur={() => trigger(field.name)}
                label={field.label}
                fullWidth
                disabled={disabled}
                multiple
              >
                {field.options?.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
          break

        case 'radioGroup':
          element = (
            <FormControl>
              <FormLabel>{field.label}</FormLabel>
              <RadioGroup row name={field.name} sx={{ ...field.sx }} value={formData[field.name] || 1}>
                {field.options?.map((option, optionIndex) => (
                  <FormControlLabel
                    {...register(field.name)}
                    onBlur={() => trigger(field.name)}
                    key={optionIndex}
                    label={option.label}
                    disabled={disabled}
                    labelPlacement='end'
                    control={<Radio color='primary' />}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )
          break

        case 'checkbox':
          element = (
            <FormControlLabel
              {...register(field.name)}
              onBlur={() => trigger(field.name)}
              control={<Checkbox checked={formData[field.name] || false} disabled={disabled} />}
              label={field.label}
            />
          )
          break

        case 'switch':
          element = (
            <FormControlLabel
              {...register(field.name)}
              onBlur={() => trigger(field.name)}
              sx={{ marginLeft: '' }}
              control={<Switch sx={{ m: 1 }} defaultChecked />}
              label={field.label}
              labelPlacement='start'
              value={formData[field.name]}
              disabled={disabled}
            />
          )
          break

        default:
          element = null
      }

      if (element) {
        formElements.push(
          <Grid item xl={field.fullWidth ? 12 : 6} xs={12} key={index}>
            <div
              style={{
                position: 'relative'
              }}
            >
              {' '}
              <div
                className='invalid-feedback'
                style={{
                  fontSize: '.75rem',
                  marginLeft: 'auto',
                  width: 'fit-content',
                  color: '#ef5350',
                  position: 'absolute',
                  top: '-1.2rem',
                  right: 0
                }}
              >
                {errors[field.name]?.message}
              </div>
              {element}
            </div>
          </Grid>
        )
      }
    })

    return (
      <div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid item container spacing={6}>
            {formElements}
          </Grid>
        </form>
      </div>
    )
  }
)

export default DynamicForm
function setValue(arg0: string, department: any) {
  throw new Error('Function not implemented.')
}
