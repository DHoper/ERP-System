import { ReactNode, createContext, useContext, useEffect, useReducer } from 'react'
import axios from 'axios'
import MatxLoading from 'src/@core/components/MatxLoading'
import { WEB_API_URL } from 'src/utils/constant'
import { getWithExpiry, setWithExpiry } from 'src/utils/utils'
import { UserIntersectionType } from 'src/types/UserTypes'
import { useRouter } from 'next/router'

interface StateType {
  accountId?: string | null
  accountData?: UserIntersectionType | null
  isInitialized?: boolean
  isAuthenticated?: boolean
}

const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') || null : null

const initialState: StateType = {
  accountId: accountId || null,
  accountData: null,
  isInitialized: true,
  isAuthenticated: false
}

enum Action {
  LOGIN = 'LOGIN',
  TOKENLOGIN = 'TOKENLOGIN',
  LOGOUT = 'LOGOUT',
  INIT = 'INIT',
  REGISTER = 'REGISTER',
  UPDATE = 'UPDATE',
  CHECKPASSWORD = 'CHECKPASSWORD'
}

export type ActionType = {
  type: Action
  payload?: StateType
}

const reducer: React.Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case Action.INIT: {
      if (!action.payload) return state
      const { isAuthenticated, accountId } = action.payload

      return { ...state, isAuthenticated, isInitialized: true, accountId }
    }

    case Action.LOGOUT: {
      return { ...state, isAuthenticated: false, accountId: null }
    }

    case Action.TOKENLOGIN: {
      if (!action.payload) return state
      const { accountData } = action.payload

      return { ...state, accountData }
    }

    case Action.LOGIN: {
      if (!action.payload) return state
      const { accountId, accountData } = action.payload

      return { ...state, isAuthenticated: true, accountId, accountData }
    }

    case Action.REGISTER: {
      return { ...state, isAuthenticated: true }
    }

    case Action.UPDATE: {
      return { ...state }
    }

    case Action.CHECKPASSWORD: {
      return { ...state }
    }

    default:
      return state
  }
}

export type AuthContextType = {
  accountId: string | null | undefined
  accountData: UserIntersectionType | null
  isInitialized?: boolean
  isAuthenticated?: boolean
  method: string
  login: (accountId: string, password: string, remember: boolean) => Promise<void>
  tokenLogin: () => Promise<void>
  logout: () => void
  register: (formData: UserIntersectionType) => Promise<void>
  update: (formData: UserIntersectionType) => Promise<void>
  checkPassword: (password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  accountId: null,
  accountData: null,
  isInitialized: false,
  isAuthenticated: false,
  method: 'JWT',
  login: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  tokenLogin: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  logout: function (): void {
    throw new Error('Function not implemented.')
  },
  register: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  update: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  checkPassword: function (): Promise<boolean> {
    throw new Error('Function not implemented.')
  }
})

type AuthProviderProps = {
  children: ReactNode
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthContextProvider')
  }

  return context
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<StateType, ActionType>>(reducer, initialState)

  const router = useRouter()

  const login = async (username: string, password: string, remember = false) => {
    const loginUrl = WEB_API_URL + '/oauth/login'
    const data = { username, password, grant_type: 'password' }
    const headers = { 'content-type': 'application/x-www-form-urlencoded' }
    try {
      const response = await axios.post(loginUrl, data, { headers })
      const accountId = response.data.user.account_id
      const accountData = response.data.user
      const token = response.data.token
      localStorage.setItem('remember', remember.toString())

      if (remember && accountId) {
        localStorage.setItem('accountId', accountId)
        sessionStorage.setItem('accountId', accountId)
      } else {
        localStorage.removeItem('accountId')
        localStorage.removeItem('token')
        sessionStorage.setItem('accountId', accountId)
      }

      setWithExpiry('token', token, 3600000) //token 有效1小時

      if (!accountData || !accountId) throw new Error('tokenLogin 取回 undefined')

      dispatch({ type: Action.LOGIN, payload: { accountId, accountData } })
      router.push('/')
    } catch (error) {
      console.error('登陸時發生錯誤:', error)
    }
  }

  const tokenLogin = async () => {
    const token = getWithExpiry('token')
    const accountId = localStorage.getItem('accountId')

    const loginUrl = `${WEB_API_URL}/accounts/${accountId}`

    const headers = {
      Authorization: 'Bearer' + token
    }

    try {
      const response = await axios.get(loginUrl, { headers })
      const accountData = response.data

      if (!accountData || !accountId) throw new Error('tokenLogin 取回 undefined')

      dispatch({ type: Action.TOKENLOGIN, payload: { accountData, accountId } })
      if (router.pathname === '/auth/login' || router.pathname === '/auth/register') router.push('/')
    } catch (error) {
      console.error(`Token驗證時發生錯誤:`, error)
    }
  }

  const register = async (formData: UserIntersectionType) => {
    const loginUrl = `${WEB_API_URL}/oauth/register`
    const headers = { 'content-type': 'application/x-www-form-urlencoded' }
    const { username, email, password } = formData
    const registerData = { username, password, email }
    try {
      const response = await axios.post(loginUrl, registerData, { headers })

      // await login(username, password)
    } catch (error) {
      console.error(`註冊帳戶時發生錯誤:`, error)
    }

    dispatch({ type: Action.REGISTER })
  }

  const update = async (formData: UserIntersectionType) => {
    const token = getWithExpiry('token')

    const headers = {
      Authorization: 'Bearer' + token
    }

    const loginUrl = `${WEB_API_URL}/accounts/${state.accountId}`

    try {
      const response = await axios.patch(loginUrl, formData, { headers })
      const accountData = response.data

      dispatch({ type: Action.REGISTER, payload: { accountData } })
    } catch (error) {
      console.error(`更新帳戶時發生錯誤:`, error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    dispatch({ type: Action.LOGOUT })
  }

  const checkPassword = async (password: string) => {
    const loginUrl = WEB_API_URL + '/oauth/login'
    if (!state.accountData) return false
    const { username } = state.accountData

    const data = { username, password, grant_type: 'password' }
    const headers = { 'content-type': 'application/x-www-form-urlencoded' }
    try {
      const response = await axios.post(loginUrl, data, { headers })

      return response.data ? true : false
    } catch (error) {
      console.error('執行 checkPassword 時發生錯誤:', error)
    }

    return false
  }
  useEffect(() => {
    ;(async () => {
      try {
        const accountId = localStorage.getItem('accountId') || sessionStorage.getItem('accountId')

        if (accountId) {
          dispatch({ type: Action.INIT, payload: { isAuthenticated: true, accountId, accountData: null } })
        } else {
          dispatch({ type: Action.INIT, payload: { isAuthenticated: false, accountId: null, accountData: null } })
        }
      } catch (err) {
        console.error(err)
        dispatch({ type: Action.INIT, payload: { isAuthenticated: false, accountId: null, accountData: null } })
      }
    })()
  }, [])

  if (!state.isInitialized) return <MatxLoading />

  return (
    <AuthContext.Provider
      value={{ ...state, method: 'JWT', login, tokenLogin, logout, register, update, checkPassword }}  //* TS 錯誤
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
