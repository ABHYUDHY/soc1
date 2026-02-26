import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })

export const login = async () => {
  const { data } = await API.post('/auth/login', { username: 'manager', password: 'manager123' })
  API.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
  return data
}

export default API
