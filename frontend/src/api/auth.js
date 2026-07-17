import apiClient from './client'

export const authAPI = {
  register: (data) => {
    console.log('Registering user:', data.username) // Debug log
    return apiClient.post('/auth/register/', data)
  },
  login: (data) => {
    console.log('Logging in user:', data.username) // Debug log
    return apiClient.post('/auth/token/', data)
  },
  refreshToken: (refresh) => {
    console.log('Refreshing token') // Debug log
    return apiClient.post('/auth/token/refresh/', { refresh })
  },
  getUpworkLoginUrl: () => {
    console.log('Getting Upwork login URL') // Debug log
    return apiClient.get('/auth/upwork/login/')
  },
  getUpworkStatus: () => {
    console.log('Getting Upwork status') // Debug log
    return apiClient.get('/auth/upwork/status/')
  },
  upworkCallback: (code) => {
    console.log('Upwork callback with code:', code) // Debug log
    return apiClient.get(`/auth/upwork/callback/?code=${code}`)
  },
}