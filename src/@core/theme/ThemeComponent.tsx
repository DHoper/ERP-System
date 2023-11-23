// ** React Imports
import { ReactNode, useContext, useEffect } from 'react'

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Config
import themeConfig from 'src/@core/configs/themeConfig'

// ** Theme Override Imports
import overrides from './overrides'
import typography from './typography'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'
import { useRouter } from 'next/router'
import AuthContext, { AuthContextType } from 'src/context/user/user'
import { getWithExpiry } from 'src/utils/utils'

interface Props {
  settings: Settings
  children: ReactNode
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { settings, children } = props

  // ** Merged ThemeOptions of Core and User
  const coreThemeConfig = themeOptions(settings)

  // ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
  let theme = createTheme(coreThemeConfig)

  // ** Continue theme creation and pass merged component overrides to CreateTheme function
  theme = createTheme(theme, {
    components: { ...overrides(theme) },
    typography: { ...typography(theme) }
  })

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  const router = useRouter()
  const isLoginPage = router.pathname === '/auth/login'
  const isRegisterPage = router.pathname === '/auth/register'

  const authContext = useContext<AuthContextType>(AuthContext)

  const token = getWithExpiry('token')

  const { accountId, accountData, tokenLogin } = authContext

  useEffect(() => {
    if ((!accountId || !token) && !isLoginPage && !isRegisterPage) {
      router.push('/auth/login')
    } else if (accountId && token && !accountData) {
      ;(async () => tokenLogin(accountId, token))()
    }
  }, [accountId, token, isLoginPage, isRegisterPage, router, tokenLogin, accountData])

  useEffect(() => {
    if (isLoginPage && accountId && token && accountData) {
      router.push('/')
    }
  }, [isLoginPage, router, token, accountId, accountData])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme) as any} />
      {children}
    </ThemeProvider>
  )
}

export default ThemeComponent
