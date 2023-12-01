// ** React Imports
import { SyntheticEvent, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import { Paper, Typography, Button, Box, Card, TabProps, styled } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Demo Tabs Importsa
import TabInfo from './components/TabInfo'
import TabAccount from './components/TabAccount'
import TabSecurity from './components/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { useTheme } from '@emotion/react'
import { useRouter } from 'next/router'
import AuthContext, { AuthContextType } from 'src/context/Auth/AuthContext'
import { UserDataType } from 'src/types/UserTypes'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { requestGet } from 'src/api/user/user'
import { throws } from 'assert'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const StyledButton = styled(Button)({
  backgroundColor: 'white',
  color: '#9155FD',
  marginBottom: '1rem',
  '&:hover': {
    backgroundColor: '#9155FD',
    color: 'white'
  }
})

const UserManagement = () => {
  const theme = useTheme()
  const router = useRouter()

  // ** State
  const [value, setValue] = useState<string>('account')
  const [isNotVerify, setIsNotVerify] = useState<boolean>(false)
  const [reSendEmail, setReSendEmail] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserDataType | null>(null)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const { id } = Array.isArray(router.query) ? router.query[0] : router.query

  useEffect(() => {
    ;(async () => {
      try {
        const responseData = await requestGet(id)
        if (!responseData) {
          throw new Error('User requestGet 取得 undefined')
        }

        setUserData(responseData)
      } catch (error) {
        console.error('執行 User requestGet 時發生錯誤:', error)
      }
    })()
  }, [id])

  return (
    <>
      <StyledButton
        variant='contained'
        startIcon={<KeyboardBackspaceIcon fontSize='medium' />}
        onClick={() => router.back()}
      >
        返回
      </StyledButton>
      {userData && (
        <Card sx={{ backgroundColor: isNotVerify ? '#fafafa' : null }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='account-settings tabs'
              sx={{
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Tab
                value='account'
                sx={{ flex: { xs: 1, xl: 'unset' } }}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>帳戶</TabName>
                  </Box>
                }
              />
              <Tab
                value='security'
                sx={{ flex: { xs: 1, xl: 'unset' } }}
                disabled={isNotVerify}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LockOpenOutline />
                    <TabName>安全性</TabName>
                  </Box>
                }
              />
              <Tab
                value='info'
                sx={{ flex: { xs: 1, xl: 'unset' } }}
                disabled={isNotVerify}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InformationOutline />
                    <TabName>其他資訊</TabName>
                  </Box>
                }
              />
            </TabList>
            {isNotVerify && (
              <Paper
                square
                elevation={1}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '.4rem 1.5rem',
                  backgroundColor: theme.palette.error.main
                }}
              >
                <Typography color={'white'} textAlign={{ xs: 'center', xl: 'start' }}>
                  帳號尚未激活，請先完成信箱驗證
                </Typography>
                <Button
                  variant='contained'
                  disabled={reSendEmail}
                  onClick={() => setReSendEmail(prev => !prev)}
                  sx={{
                    '&.Mui-disabled': {
                      background: '#eaeaea',
                      color: '#9e9e9e'
                    }
                  }}
                >
                  {reSendEmail ? '信件已寄出' : '重寄認證信'}
                </Button>
              </Paper>
            )}

            <TabPanel sx={{ p: 8 }} value='account'>
              <TabAccount userData={userData} disabled={isNotVerify} />
            </TabPanel>
            <TabPanel sx={{ p: 8 }} value='security'>
              <TabSecurity currentPassword={userData.password} />
            </TabPanel>
            <TabPanel sx={{ p: 8 }} value='info'>
              <TabInfo userData={userData} />
            </TabPanel>
          </TabContext>
        </Card>
      )}
    </>
  )
}

export default UserManagement
