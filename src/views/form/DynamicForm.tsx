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
  SelectChangeEvent,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Divider,
  Typography,
  Chip
} from '@mui/material'
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { DynamicFormType } from '../../types/ComponentsTypes'
import PhoneInput from './fieldElements/PhoneInput'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import zhTW from 'date-fns/locale/zh-TW'
import { format } from 'date-fns'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { ObjectSchema } from 'yup'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { ShowPasswordType } from 'src/types/AuthTypes'

interface DynamicFormProps {
  fields: DynamicFormType[]
  vaildationSchema: ObjectSchema<any>
  formData: Record<string, any>
  handleSubmitForm: (formData: object) => Promise<void>
  disabled?: boolean
  spacing?: number
}

const DynamicForm = forwardRef<any, DynamicFormProps>(
  ({ fields, vaildationSchema, formData, handleSubmitForm, disabled = false, spacing = 6 }, ref) => {
    const [showPassword, setShowPassword] = useState<ShowPasswordType>({
      password: false,
      confirmPassword: false
    })

    // ** 驗證
    const formOptions = {
      resolver: yupResolver(vaildationSchema),
      defaultValues: formData || null
    }

    const { register, handleSubmit, reset, trigger, control, formState } = useForm(formOptions)
    const { errors } = formState

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        await handleSubmit(handleSubmitForm)()
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
          element = (
            <TextField
              {...register(fieldFactor.name)}
              onBlur={() => trigger(fieldFactor.name)}
              label={fieldFactor.label}
              type={fieldFactor.fieldType}
              variant='outlined'
              sx={{ ...fieldFactor.sx }}
              minRows={fieldFactor.minRows}
              multiline={!!fieldFactor.minRows}
              disabled={disabled}
              fullWidth
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
                sx={{ ...fieldFactor.sx }}
              />
            </FormControl>
          )

          break

        /*   case 'phone':
        element = (
          <PhoneInput
            value={formData[fieldFactor.name]}
            disabled={disabled}
          />
        )
        break */
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
        case 'divider':
          element = (
            <Divider sx={{ ...fieldFactor.sx, marginTop: 12 }} textAlign='center'>
              <Chip color='primary' label={fieldFactor.label} />
              {/* <Typography variant='h7' fontWeight={'600'}>
                {fieldFactor.label}
              </Typography> */}
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
