import apiClient from './client'

export const messagesAPI = {
  getThreads: (params = {}) => apiClient.get('/messages/', { params }),
  getThread: (id) => apiClient.get(`/messages/${id}/`),
  getOpenInUpwork: (id) => apiClient.get(`/messages/${id}/open-in-upwork/`),
}