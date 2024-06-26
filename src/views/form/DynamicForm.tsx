import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

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
  Button,
  Switch,
  FormGroup,
  Card
} from '@mui/material'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import zhTW from 'date-fns/locale/zh-TW'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, FormProvider, UseFormReturn, useForm, useWatch } from 'react-hook-form'
import { ObjectSchema } from 'yup'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import 'react-datepicker/dist/react-datepicker.css'

import { ShowPasswordType } from 'src/types/AuthTypes'
import { DynamicFormType } from '../../types/ComponentsTypes'

interface DynamicFormProps {
  fields: DynamicFormType[]
  validationSchema: ObjectSchema<any>
  formData: Record<string, any>
  handleSubmitForm: (formData: any) => Promise<void> // * 待優化  如何讓表單組件能符合各種形式的form TS?
  dependencies?: { method: (watchedField: any, methods: UseFormReturn<any>) => void; dependency: string }[]
  disabledAll?: boolean
  spacing?: number
}

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

const DynamicForm = forwardRef<any, DynamicFormProps>(
  ({ fields, validationSchema, formData, handleSubmitForm, dependencies, disabledAll = false, spacing = 6 }, ref) => {
    const [showPassword, setShowPassword] = useState<ShowPasswordType>({
      currentPassword: false,
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

    // ** React hook form 配置
    const formOptions = {
      resolver: yupResolver(strippedValidationSchema),
      defaultValues: formData || null,
      context: {
        currentAccount: formData || null
      }
    }

    const methods = useForm(formOptions)
    const { register, handleSubmit, reset, trigger, control, formState, setValue, getValues } = methods
    const { errors } = formState

    // ** 依賴關係
    const dependenciesName = []

    if (dependencies && dependencies.length > 0) {
      for (const dependency of dependencies) {
        dependenciesName.push(dependency.dependency)
      }
    }

    const watchDependencies = useWatch({ control, name: dependenciesName })

    const prevWatchDependencies = usePrevious(watchDependencies)

    useEffect(() => {
      if (!dependencies || !prevWatchDependencies) return

      dependencies.forEach(({ method }, index) => {
        if (watchDependencies[index] !== prevWatchDependencies[index]) {
          method(watchDependencies[index], methods)
        }
      })
    }, [dependencies, methods, prevWatchDependencies, watchDependencies])

    // ** 表單操作
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
                  disabled={disabledAll || fieldFactor.disabled}
                  fullWidth
                />
              )}
            />
          )
          break
        case 'password':
          const handleClickShowPassword = (type: 'password' | 'confirmPassword' | 'currentPassword') => {
            const carrier = { ...showPassword, [type]: !showPassword[type] }
            setShowPassword(carrier)
          }

          const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
          }

          if (
            fieldFactor.name !== 'password' &&
            fieldFactor.name !== 'confirmPassword' &&
            fieldFactor.name !== 'currentPassword'
          )
            return

          element = (
            <FormControl sx={{ ...fieldFactor.sx }} fullWidth>
              <InputLabel htmlFor='auth-login-password'>{fieldFactor.label}</InputLabel>

              <OutlinedInput
                id={fieldFactor.name}
                {...register(fieldFactor.name)}
                label={fieldFactor.label}
                onBlur={() => trigger(fieldFactor.name)}
                disabled={disabledAll || fieldFactor.disabled}
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
            <FormControl sx={{ ...fieldFactor.sx }} fullWidth>
              <Controller
                name={fieldFactor.name}
                control={control}
                disabled={disabledAll || fieldFactor.disabled}
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
                      onChange={date => {
                        field.onChange(date)
                      }}
                    />
                  </DatePickerWrapper>
                )}
              />
            </FormControl>
          )
          break
        case 'select':
          element = (
            <FormControl sx={{ ...fieldFactor.sx }} fullWidth variant='outlined'>
              <InputLabel>{fieldFactor.label}</InputLabel>
              <Controller
                name={fieldFactor.name}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onBlur={() => trigger(fieldFactor.name)}
                    label={fieldFactor.label}
                    disabled={disabledAll || fieldFactor.disabled}
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
            <FormControl fullWidth sx={{ ...fieldFactor.sx }} variant='outlined'>
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
                    disabled={disabledAll || fieldFactor.disabled}
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
            <FormControl fullWidth sx={{ ...fieldFactor.sx }} disabled={disabledAll || fieldFactor.disabled}>
              <FormLabel>{fieldFactor.label}</FormLabel>
              <Controller
                name={fieldFactor.name}
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row onBlur={() => trigger(fieldFactor.name)}>
                    {fieldFactor.options?.map((option, optionIndex) => (
                      <FormControlLabel
                        sx={{ ...fieldFactor.optionSx }}
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
                        sx={{ ...fieldFactor.optionSx }}
                        checked={field.value || false}
                        disabled={disabledAll || fieldFactor.disabled}
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
        case 'switch':
          element = (
            <FormControl fullWidth sx={{ alignItems: 'start', paddingY: 2, ...fieldFactor.sx }}>
              <Controller
                name={fieldFactor.name}
                control={control}
                disabled={disabledAll || fieldFactor.disabled}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value || false} />}
                    label={fieldFactor.label}
                    labelPlacement='start'
                  />
                )}
              />
            </FormControl>
          )
          break
        case 'checkboxGroup':
          element = (
            <Card sx={{ ...fieldFactor.sx }} variant='outlined'>
              <FormControl fullWidth variant='outlined'>
                <FormGroup sx={{ padding: 4 }}>
                  <Grid container xl={12}>
                    {fieldFactor.options?.map(option => (
                      <Grid item xs={3} key={option.value}>
                        <FormControl fullWidth>
                          <FormControlLabel
                            onBlur={() => trigger(fieldFactor.name)}
                            control={
                              <Controller
                                name={`${fieldFactor.name}[${option.value}]`}
                                control={control}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    sx={{ ...fieldFactor.optionSx }}
                                    checked={field.value || false}
                                    disabled={disabledAll || fieldFactor.disabled}
                                    onChange={e => {
                                      field.onChange(e)
                                    }}
                                  />
                                )}
                              />
                            }
                            label={option.label}
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
            </Card>
          )
          break
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
        case 'customizeField':
          const ComponentToRender = fieldFactor.component
          element = <ComponentToRender {...methods} />
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
      <FormProvider {...methods}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid item container spacing={spacing}>
            {formElements}
          </Grid>
        </form>
      </FormProvider>
    )
  }
)

export default DynamicForm
