// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useRef, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { RegisterFormType, RegisterValidationSchema, ShowPasswordType } from 'src/types/AuthTypes'
import MailAirplane from './component/MailAirplane'
import Container from '@mui/material/Container'
import DynamicForm from 'src/views/form/DynamicForm'
import { DynamicFormType } from 'src/types/ComponentsTypes'
import AuthContext, { AuthContextType } from 'src/context/Auth/AuthContext'
import { useRouter } from 'next/router'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const RegisterPage = () => {
  // ** States
  const [isRegister, setIsRegister] = useState<boolean>(false)
  const [formField, setFormField] = useState<DynamicFormType[]>()
  const [formData, setFormData] = useState({})
  const [policyAgree, setPolicyAgree] = useState<boolean>(false)

  const router = useRouter()

  // ** Hook
  const dynamicFormRef = useRef(null)

  const dynamicFormFields: DynamicFormType[] = [
    {
      name: 'username',
      fieldType: 'text',
      label: '暱稱',
      fullWidth: true
    },
    {
      name: 'email',
      fieldType: 'text',
      label: '信箱',
      fullWidth: true
    },
    {
      name: 'password',
      fieldType: 'password',
      label: '密碼',
      fullWidth: true
    },
    {
      name: 'confirmPassword',
      fieldType: 'password',
      label: '確認密碼',
      fullWidth: true
    },
    {
      name: 'policyAgree',
      fieldType: 'checkbox',
      fullWidth: true,
      label: (
        <Fragment>
          <span style={{ fontSize: '.875rem' }}>我同意</span>
          <Link href='/' passHref>
            <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>隱私政策和條款</LinkStyled>
          </Link>
        </Fragment>
      ),
      action: () => {
        setPolicyAgree(!policyAgree)
        console.log(policyAgree, 88)
      }
    }
  ]

  const handleChildSubmit = () => {
    if (!dynamicFormRef.current) return
    dynamicFormRef.current.submitForm()
  }

  const authContext = useContext<AuthContextType>(AuthContext)

  const handleRegister = async (formData: object) => {
    console.log(formData, 55)
    try {
      const { register } = authContext
      await register(formData)
      router.push('/auth/login')
    } catch (error) {
      console.error('使用 register context 時發生錯誤:', error)
    }

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
              一一一一管理系統
            </Typography>
          </Box>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              {isRegister ? '註冊完成' : '歡迎加入'}
            </Typography>
            <Typography variant='body2'>{isRegister ? '請進行信箱認證以開通帳戶' : '請填寫正確資訊'}</Typography>
          </Box>
          {!isRegister ? (
            <>
              <DynamicForm
                ref={dynamicFormRef}
                fields={dynamicFormFields}
                formData={formData}
                handleSubmitForm={handleRegister}
                validationSchema={RegisterValidationSchema}
                spacing={4}
              />
              <div style={{ marginTop: '3rem' }}>
                {' '}
                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ marginBottom: 7 }}
                  disabled={!policyAgree}
                  onClick={handleChildSubmit}
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
              </div>
            </>
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
