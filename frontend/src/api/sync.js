import apiClient from './client'

export const syncAPI = {
  getStatus: () => apiClient.get('/sync/status/'),
  getHistory: (params = {}) => apiClient.get('/sync/history/', { params }),
  triggerSync: () => apiClient.post('/sync/trigger/'),
}