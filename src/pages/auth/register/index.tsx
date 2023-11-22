// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/@core/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterFormType, ShowPasswordType } from 'src/types/AuthTypes'
import MailAirplane from './component/MailAirplane'
import Container from '@mui/material/Container'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const formOptions = { resolver: yupResolver(RegisterValidationSchema) }

const RegisterPage = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<ShowPasswordType>({ password: false, confirmPassword: false })
  const [isRegister, setIsRegister] = useState<boolean>(true)
  const [policyAgree, setPolicyAgree] = useState<boolean>(false)

  // ** Hook

  const { register, handleSubmit, reset, trigger, formState } = useForm(formOptions)
  const { errors } = formState

  const handleClickShowPassword = (type: 'password' | 'confirmPassword') => {
    const carrier = { ...showPassword, [type]: !showPassword[type] }
    setShowPassword(carrier)
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleRegister = (formdata: RegisterFormType) => {
    setIsRegister(true)
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h4'
              color={'primary'}
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              一一一一會員系統
            </Typography>
          </Box>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              {isRegister ? '註冊完成' : '歡迎加入'}
            </Typography>
            <Typography variant='body2'>{isRegister ? '請進行信箱認證以開通帳戶' : '請填寫正確資訊'}</Typography>
          </Box>
          {!isRegister ? (
            <form noValidate autoComplete='off' onSubmit={handleSubmit(handleRegister)}>
              <div
                className='invalid-feedback'
                style={{ fontSize: '.75rem', marginLeft: 'auto', width: 'fit-content', color: '#ef5350' }}
              >
                {errors.username?.message}
              </div>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-register-username'>使用者名稱</InputLabel>
                <OutlinedInput
                  id='auth-register-username'
                  {...register('username')}
                  onBlur={() => trigger('username')}
                  type={'text'}
                  label='使用者名稱'
                  sx={{ marginBottom: 4 }}
                />
              </FormControl>{' '}
              <div
                className='invalid-feedback'
                style={{ fontSize: '.75rem', marginLeft: 'auto', width: 'fit-content', color: '#ef5350' }}
              >
                {errors.email?.message}
              </div>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-register-email'>信箱</InputLabel>

                <OutlinedInput
                  id='auth-register-email'
                  {...register('email')}
                  onBlur={() => trigger('email')}
                  type={'email'}
                  label='信箱'
                  sx={{ marginBottom: 4 }}
                />
              </FormControl>
              <div
                className='invalid-feedback'
                style={{ fontSize: '.75rem', marginLeft: 'auto', width: 'fit-content', color: '#ef5350' }}
              >
                {errors.password?.message}
              </div>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-password'>密碼</InputLabel>

                <OutlinedInput
                  id='auth-login-password'
                  {...register('password')}
                  label='Password'
                  onBlur={() => trigger('password')}
                  type={showPassword.password ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => handleClickShowPassword('password')}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{ marginBottom: 4 }}
                />
              </FormControl>
              <div
                className='invalid-feedback'
                style={{ fontSize: '.75rem', marginLeft: 'auto', width: 'fit-content', color: '#ef5350' }}
              >
                {errors.confirmPassword?.message}
              </div>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-confirmpassword'>確認密碼</InputLabel>
                <OutlinedInput
                  id='auth-login-confirmpassword'
                  {...register('confirmPassword')}
                  label='Password'
                  onBlur={() => trigger('confirmPassword')}
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => handleClickShowPassword('confirmPassword')}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle confirmPassword visibility'
                      >
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value={policyAgree} onChange={() => setPolicyAgree(!policyAgree)} />}
                label={
                  <Fragment>
                    <span>我同意</span>
                    <Link href='/' passHref>
                      <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                        隱私政策和條款
                      </LinkStyled>
                    </Link>
                  </Fragment>
                }
              />
              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                sx={{ marginBottom: 7 }}
                disabled={!policyAgree}
              >
                註冊
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ marginRight: 2 }}>
                  已有帳號?
                </Typography>
                <Typography variant='body2'>
                  <Link passHref href='/auth/login'>
                    <LinkStyled>登陸</LinkStyled>
                  </Link>
                </Typography>
              </Box>
            </form>
          ) : (
            <>
              <MailAirplane />
            </>
          )}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
