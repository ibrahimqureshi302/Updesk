import apiClient from './client'

export const clientsAPI = {
  getClients: (params = {}) => apiClient.get('/clients/', { params }),
  getClient: (id) => apiClient.get(`/clients/${id}/`),
  updateClientNotes: (id, notes) => apiClient.patch(`/clients/${id}/`, { notes }),
}