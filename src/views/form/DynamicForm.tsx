import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import {
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Divider,
  Chip,
  Button
} from '@mui/material'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import zhTW from 'date-fns/locale/zh-TW'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { ObjectSchema } from 'yup'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

import { ShowPasswordType } from 'src/types/AuthTypes'
import { DynamicFormType } from '../../types/ComponentsTypes'

interface DynamicFormProps {
  fields: DynamicFormType[]
  validationSchema: ObjectSchema<any>
  formData: Record<string, any>
  handleSubmitForm: (formData: object) => Promise<void>
  disabled?: boolean
  spacing?: number
}

const DynamicForm = forwardRef<any, DynamicFormProps>(
  ({ fields, validationSchema, formData, handleSubmitForm, disabled = false, spacing = 6 }, ref) => {
    const [showPassword, setShowPassword] = useState<ShowPasswordType>({
      password: false,
      confirmPassword: false
    })

    // ** 驗證
    if (formData.password) {
      formData.confirmPassword = formData.password
    }

    const fieldsToRemove = Object.keys(validationSchema.fields).filter(fieldName => !formData.hasOwnProperty(fieldName))

    const strippedValidationSchema = fieldsToRemove.reduce((schema, fieldName) => {
      return schema.clone().omit(fieldName as unknown as (string | number | symbol)[])
    }, validationSchema)

    const formOptions = {
      resolver: yupResolver(strippedValidationSchema),
      defaultValues: formData || null,
      context: {
        currentAccount: formData || null
      }
    }

    const { register, handleSubmit, reset, trigger, getValues, control, formState } = useForm(formOptions)
    const { errors } = formState

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        try {
          await handleSubmit(handleSubmitForm)()
        } catch (error) {
          console.error('DynamicForm 表單提交失敗:', error)
        }
      },
      resetForm: () => {
        reset()
      }
    }))

    const formElements: React.ReactNode[] = []

    fields.map((fieldFactor: DynamicFormType, index: number) => {
      let element: React.ReactNode

      switch (fieldFactor.fieldType) {
        case 'text':
        case 'email':
        case 'tel':
        case 'number':
          element = (
            <Controller
              name={fieldFactor.name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onBlur={() => {
                    trigger(fieldFactor.name)
                  }}
                  label={fieldFactor.label}
                  type={fieldFactor.fieldType}
                  variant='outlined'
                  sx={{ ...fieldFactor.sx }}
                  minRows={fieldFactor.minRows}
                  multiline={!!fieldFactor.minRows}
                  InputProps={{
                    inputProps: fieldFactor.inputProps
                  }}
                  disabled={disabled}
                  fullWidth
                />
              )}
            />
          )
          break
        case 'password':
          const handleClickShowPassword = (type: 'password' | 'confirmPassword') => {
            const carrier = { ...showPassword, [type]: !showPassword[type] }
            setShowPassword(carrier)
          }

          const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
          }

          if (fieldFactor.name !== 'password' && fieldFactor.name !== 'confirmPassword') return

          element = (
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>{fieldFactor.label}</InputLabel>

              <OutlinedInput
                id={fieldFactor.name}
                {...register(fieldFactor.name)}
                label={fieldFactor.label}
                sx={{ ...fieldFactor.sx }}
                onBlur={() => trigger(fieldFactor.name)}
                type={showPassword[fieldFactor.name] ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => handleClickShowPassword(fieldFactor.name as 'password' | 'confirmPassword')}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {showPassword[fieldFactor.name] ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )

          break
        case 'date':
          const CustomInput = forwardRef((props, ref) => (
            <TextField inputRef={ref} label={fieldFactor.label} fullWidth {...props} />
          ))

          registerLocale('zh-TW', zhTW)
          setDefaultLocale('zh-TW')

          element = (
            <FormControl fullWidth disabled={false}>
              <Controller
                name={fieldFactor.name}
                control={control}
                render={({ field }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      {...field}
                      customInput={<CustomInput />}
                      onBlur={() => field.onBlur()}
                      selected={field.value ? new Date(field.value) : null}
                      placeholderText='YYYY-MM-DD (EEE)'
                      locale='zh-TW'
                      dateFormat='yyyy年 MMM dd日 (EEE)'
                      onChange={date => field.onChange(date)}
                    />
                  </DatePickerWrapper>
                )}
              />
            </FormControl>
          )
          break
        case 'select':
          element = (
            <FormControl fullWidth variant='outlined'>
              <InputLabel>{fieldFactor.label}</InputLabel>
              <Controller
                name={fieldFactor.name}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onBlur={() => trigger(fieldFactor.name)}
                    label={fieldFactor.label}
                    disabled={disabled}
                  >
                    {fieldFactor.options?.map((option, optionIndex) => (
                      <MenuItem key={optionIndex} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          )
          break
        case 'multipleSelect':
          element = (
            <FormControl fullWidth variant='outlined'>
              <InputLabel>{fieldFactor.label}</InputLabel>
              <Controller
                name={fieldFactor.name}
                control={control}
                render={({ field }) => (
                  <Select
                    multiple
                    {...field}
                    onBlur={() => trigger(fieldFactor.name)}
                    label={fieldFactor.label}
                    disabled={disabled}
                  >
                    {fieldFactor.options?.map((option, optionIndex) => (
                      <MenuItem key={optionIndex} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          )
          break
        case 'radioGroup':
          element = (
            <FormControl fullWidth disabled={disabled}>
              <FormLabel>{fieldFactor.label}</FormLabel>
              <Controller
                name={fieldFactor.name}
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row onBlur={() => trigger(fieldFactor.name)} sx={{ ...fieldFactor.sx }}>
                    {fieldFactor.options?.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        label={option.label}
                        value={option.value}
                        control={<Radio color='primary' />}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          )
          break
        case 'checkbox':
          element = (
            <FormControl fullWidth>
              <FormControlLabel
                onBlur={() => trigger(fieldFactor.name)}
                sx={{ ...fieldFactor.sx }}
                control={
                  <Controller
                    name={fieldFactor.name}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value || false}
                        disabled={disabled}
                        onChange={e => {
                          field.onChange(e)
                          fieldFactor.action && fieldFactor.action()
                        }}
                      />
                    )}
                  />
                }
                label={fieldFactor.label}
              />
            </FormControl>
          )
          break
        // case 'switch':
        //   element = (
        //     <FormControlLabel
        //       {...register(fieldFactor.name)}
        //       onBlur={() => trigger(fieldFactor.name)}
        //       sx={{ marginLeft: '' }}
        //       control={<Switch sx={{ m: 1 }} defaultChecked />}
        //       label={fieldFactor.label}
        //       labelPlacement='start'
        //       value={formData[fieldFactor.name]}
        //       disabled={disabled}
        //     />
        //   )
        //   break
        case 'button':
          element = (
            <div>
              <Button
                variant='contained'
                color={
                  fieldFactor.color as
                    | 'error'
                    | 'primary'
                    | 'secondary'
                    | 'info'
                    | 'success'
                    | 'warning'
                    | 'inherit'
                    | undefined
                }
                startIcon={fieldFactor.startIcon}
                onClick={fieldFactor.action}
                fullWidth
                sx={{ ...fieldFactor.sx }}
              >
                {fieldFactor.label}
              </Button>
            </div>
          )
          break
        case 'divider':
          element = (
            <Divider sx={{ ...fieldFactor.sx, marginTop: 12 }} textAlign='center'>
              <Chip color='primary' label={fieldFactor.label} />
            </Divider>
          )
          break
        default:
          element = null
      }

      if (element) {
        formElements.push(
          <Grid item xl={fieldFactor.fullWidth ? 12 : 6} xs={12} key={index}>
            <div
              style={{
                position: 'relative'
              }}
            >
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
                {errors[fieldFactor.name]?.message}
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
          <Grid item container spacing={spacing}>
            {formElements}
          </Grid>
        </form>
      </div>
    )
  }
)

export default DynamicForm
