// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import PeopleIcon from '@mui/icons-material/People'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    // {
    //   title: '儀錶板',
    //   icon: HomeOutline,
    //   path: '/'
    // },
    {
      title: '使用者管理',
      icon: AccountCogOutline,
      path: '/users'
    },
    {
      sectionTitle: '主控板'
    },
    {
      title: '會員管理',
      icon: PeopleIcon,
      path: '/members'
    },
    {
      title: '讀卡機管理',
      icon: PeopleIcon,
      subList: [{ title: '裝置管理', path: '/cardReader/devices' }]
    },
    {
      title: '卡片管理',
      icon: PeopleIcon,
      subList: [
        { title: '卡片管理', path: '/cards/cardsManagement' },
        { title: '卡片群組設定', path: '/cards/cards' }
      ]
    },
    {
      title: '登陸',
      icon: Login,
      path: '/auth/login',
      openInNewTab: true
    },
    {
      title: '註冊',
      icon: AccountPlusOutline,
      path: '/auth/register',
      openInNewTab: true
    },
  ]
}

export default navigation
