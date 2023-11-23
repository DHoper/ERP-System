// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled, useTheme } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import Box from '@mui/material/Box'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

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
import { Paper, Stack, Typography, Button, IconButton } from '@mui/material'
import { ClassNames } from '@emotion/react'
import { formatBirthDate } from 'src/utils/format'
import { useRouter } from 'next/router'

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
    color: 'white',
  },
});


const UserManagement = () => {
  const theme = useTheme()

  const router = useRouter()

  // ** State
  const [value, setValue] = useState<string>('account')
  const [isNotVertify, setIsNotVertify] = useState<boolean>(false)
  const [reSendEmail, setReSendEmail] = useState<boolean>(false)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <>
      <StyledButton
        variant='contained'
        startIcon={<KeyboardBackspaceIcon fontSize='medium' />}
        onClick={() => router.back()}
      >
        返回
      </StyledButton>
      <Card sx={{ backgroundColor: isNotVertify ? '#fafafa' : null }}>
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
              disabled={isNotVertify}
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
              disabled={isNotVertify}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InformationOutline />
                  <TabName>其他資訊</TabName>
                </Box>
              }
            />
          </TabList>
          {isNotVertify && (
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
            <TabAccount userData={userData} disabled={isNotVertify} />
          </TabPanel>
          <TabPanel sx={{ p: 8 }} value='security'>
            <TabSecurity currentPassword={userData.password} />
          </TabPanel>
          <TabPanel sx={{ p: 8 }} value='info'>
            <TabInfo userData={userData} />
          </TabPanel>
        </TabContext>
      </Card>
    </>
  )
}

/**
 * Description placeholder
 * @date 2023/11/20 - 上午9:32:34
 *
 * @type {{ _id: string; avatarImgUrl: string; username: string; name: string; password: string; email: string; phone: string; address: string; gender: number; department: number; jobTitle: string; languages: {}; country: string; intro: string; birthDate: string; isActive: boolean; }}
 */
let userData = {
  _id: '1',
  avatarImgUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  username: 'john_doe',
  name: 'John Doe',
  password: 'secure_password',
  email: 'john.doe@example.com',
  phone: '0977852245',
  address: '123 Main St, Cityville',
  gender: 1,
  department: 3,
  jobTitle: '前端工程師',
  languages: [1],
  country: '緬甸',
  intro: 'A asdwdas asddasdasfwawadss. sadla;sdsadksa;ldk asdasdkl;asd\nAsadsdaa\nSaslkdadalkjdadjl',
  birthDate: 'Fri Nov 03 2023 00:00:00 GMT+0800 (台北標準時間)',
  isActive: true
}

// userData.birthDate = formatBirthDate(userData.birthDate)

export default UserManagement
