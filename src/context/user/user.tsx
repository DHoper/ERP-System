import { ReactNode, createContext, useEffect, useReducer } from 'react'
import axios from 'axios'
import MatxLoading from 'src/@core/components/MatxLoading'
import { WEB_API_URL } from 'src/utils/constant'
import { setWithExpiry } from 'src/utils/utils'

interface StateType {
  userId: string | null
  isInitialised?: boolean
  isAuthenticated?: boolean
}

const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || null : null

const initialState: StateType = {
  userId: userId || null,
  isInitialised: true,
  isAuthenticated: false
}

// const isValidToken = (accessToken) => {
//   if (!accessToken) return false;

//   const decodedToken = jwtDecode(accessToken);
//   const currentTime = Date.now() / 1000;
//   return decodedToken.exp > currentTime;
// };

// const setSession = (accessToken) => {
//   if (accessToken) {
//     localStorage.setItem('accessToken', accessToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//   } else {
//     localStorage.removeItem('accessToken');
//     delete axios.defaults.headers.common.Authorization;
//   }
// };

export type AuthContextType = {
  userId: string | null
  isInitialised?: boolean
  isAuthenticated?: boolean
  method: string
  login: (userId: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
  register: (email: string, userId: string, password: string) => Promise<void>
}

enum Action {
  LOGIN = 'LOGIN',
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
      const { isAuthenticated, userId } = action.payload

      return { ...state, isAuthenticated, isInitialised: true, userId }
    }

    case Action.LOGOUT: {
      return { ...state, isAuthenticated: false, userId: null }
    }

    case Action.LOGIN: {
      if (!action.payload) return state
      const { userId } = action.payload

      return { ...state, isAuthenticated: true, userId }
    }

    case Action.REGISTER: {
      if (!action.payload) return state
      const { userId } = action.payload

      return { ...state, isAuthenticated: true, userId }
    }

    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isInitialised: false,
  isAuthenticated: false,
  method: 'JWT',
  login: function (): Promise<void> {
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
      const userId = response.data.user.username //!暫時使用username 記得改回!
      const token = response.data.token
      localStorage.setItem('remember', remember.toString())

      if (remember) {
        localStorage.setItem('userId', userId)
        sessionStorage.setItem('userId', userId)
      } else {
        localStorage.removeItem('userId')
        localStorage.removeItem('token')
        sessionStorage.setItem('userId', userId)
      }
      setWithExpiry('token', token, 3600000) //token 有效1小時
      dispatch({ type: Action.LOGIN, payload: { userId } })
    })
  }

  const register = async (email: string, username: string, password: string) => {
    const response = await axios.post('/api/auth/register', { email, username, password })
    const { userId } = response.data

    dispatch({ type: Action.REGISTER, payload: { userId } })
  }

  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    dispatch({ type: Action.LOGOUT })
  }

  useEffect(() => {
    ;(async () => {
      try {
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId')

        if (userId) {
          dispatch({ type: Action.INIT, payload: { isAuthenticated: true, userId } })
        }
      } catch (err) {
        console.error(err)
        dispatch({ type: Action.INIT, payload: { isAuthenticated: false, userId: null } })
      }
    })()
  }, [])

  // SHOW LOADER
  if (!state.isInitialised) return <MatxLoading />

  return (
    <AuthContext.Provider value={{ ...state, method: 'JWT', login, logout, register }}>{children}</AuthContext.Provider>
  )
}

export default AuthContext
