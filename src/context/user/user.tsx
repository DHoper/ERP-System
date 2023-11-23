import { ReactNode, createContext, useEffect, useReducer } from 'react'
import axios from 'axios'
import MatxLoading from 'src/@core/components/MatxLoading'
import { WEB_API_URL } from 'src/utils/constant'
import { setWithExpiry } from 'src/utils/utils'
import { UserDataType } from 'src/types/UserType'

interface StateType {
  accountId?: string | null
  accountData?: UserDataType | null
  isInitialised?: boolean
  isAuthenticated?: boolean
}

const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') || null : null

const initialState: StateType = {
  accountId: accountId || null,
  accountData: null,
  isInitialised: true,
  isAuthenticated: false
}

enum Action {
  LOGIN = 'LOGIN',
  TOKENLOGIN = 'TOKENLOGIN',
  LOGOUT = 'LOGOUT',
  INIT = 'INIT',
  REGISTER = 'REGISTER'
}

export type ActionType = {
  type: Action
  payload?: StateType
}

const reducer: React.Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case Action.INIT: {
      if (!action.payload) return state
      const { isAuthenticated, accountId, accountData } = action.payload

      return { ...state, isAuthenticated, isInitialised: true, accountId, accountData }
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
      const { accountId } = action.payload

      return { ...state, isAuthenticated: true, accountId }
    }

    case Action.REGISTER: {
      return { ...state, isAuthenticated: true }
    }

    default:
      return state
  }
}

export type AuthContextType = {
  accountId: string | null
  accountData: UserDataType | null
  isInitialised?: boolean
  isAuthenticated?: boolean
  method: string
  login: (accountId: string, password: string, remember: boolean) => Promise<void>
  tokenLogin: (accountId: string, token: string) => Promise<void>
  logout: () => void
  register: (formData: object) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  accountId: null,
  accountData: null,
  isInitialised: false,
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
  }
})

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<StateType, ActionType>>(reducer, initialState)

  const login = async (username: string, password: string, remember = false) => {
    const loginUrl = WEB_API_URL + 'oauth2/token'
    const data = { username, password, grant_type: 'password' }
    const headers = { 'content-type': 'application/x-www-form-urlencoded' }
    await axios.post(loginUrl, data, { headers }).then(function (response) {
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
      dispatch({ type: Action.LOGIN, payload: { accountId, accountData } })
    })
  }

  const tokenLogin = async (accountId: string, token: string) => {
    const loginUrl = `${WEB_API_URL}accounts/${accountId}`

    const headers = {
      Authorization: 'Bearer' + token
    }

    try {
      const response = await axios.get(loginUrl, { headers })
      const accountData = response.data

      dispatch({ type: Action.TOKENLOGIN, payload: { accountData } })
    } catch (error) {
      console.error(`Token驗證時發生錯誤:`, error)
    }
  }

  const register = async (formData: object) => {
    const loginUrl = `${WEB_API_URL}oauth2/token/register`
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

  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    dispatch({ type: Action.LOGOUT })
  }

  useEffect(() => {
    ;(async () => {
      try {
        const accountId = localStorage.getItem('accountId') || sessionStorage.getItem('accountId')

        if (accountId) {
          dispatch({ type: Action.INIT, payload: { isAuthenticated: true, accountId, accountData: null } })
        }
      } catch (err) {
        console.error(err)
        dispatch({ type: Action.INIT, payload: { isAuthenticated: false, accountId: null, accountData: null } })
      }
    })()
  }, [])

  if (!state.isInitialised) return <MatxLoading />

  return (
    <AuthContext.Provider value={{ ...state, method: 'JWT', login, tokenLogin, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
