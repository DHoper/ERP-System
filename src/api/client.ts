import axios from 'axios'
import { getWithExpiry } from 'src/utils/utils'

const token = getWithExpiry('token')
const headers = {
  Authorization: 'Bearer' + token
}

export const authApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers
})
