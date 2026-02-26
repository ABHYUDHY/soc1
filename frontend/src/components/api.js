import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })

export const login = async () => {
  const username = import.meta.env.VITE_SOC_USERNAME || 'manager'
  const password = import.meta.env.VITE_SOC_PASSWORD || 'manager123'
  const { data } = await API.post('/auth/login', { username, password })
  API.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
  return data
}

export default API
