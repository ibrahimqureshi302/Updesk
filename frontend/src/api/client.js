import axios from 'axios'
import { getAccessToken, setAccessToken, getRefreshToken, logout } from '../utils/auth'

// Use the correct API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

console.log('API Base URL:', API_BASE_URL) // Debug log

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Change to false for JWT auth
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`) // Debug log
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status) // Debug log
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    console.error('Response error:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })
        
        const { access } = response.data
        setAccessToken(access)
        originalRequest.headers.Authorization = `Bearer ${access}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError)
        logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient