import apiClient from './client'

export const notificationsAPI = {
  list:                   (params = {}) => apiClient.get('/notifications/', { params }).then(r => r.data),
  markAllRead:            ()            => apiClient.post('/notifications/mark-read/').then(r => r.data),
  markRead:               (id)          => apiClient.patch(`/notifications/${id}/`, { read: true }).then(r => r.data),
  getWhatsAppSettings:    ()            => apiClient.get('/notifications/whatsapp-settings/').then(r => r.data),
  updateWhatsAppSettings: (data)        => apiClient.put('/notifications/whatsapp-settings/', data).then(r => r.data),
  getWhatsAppStatus:      ()            => apiClient.get('/notifications/whatsapp-status/').then(r => r.data),
  sendTestWhatsApp:       (data = {})   => apiClient.post('/notifications/whatsapp-test/', data).then(r => r.data),
}
