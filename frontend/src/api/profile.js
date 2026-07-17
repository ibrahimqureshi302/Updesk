import apiClient from './client'

export const profileAPI = {
  getProfile: () => apiClient.get('/profile/'),
}