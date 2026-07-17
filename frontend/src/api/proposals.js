import apiClient from './client'

export const proposalsAPI = {
  getProposals: (params = {}) => apiClient.get('/proposals/', { params }),
  getProposal: (id) => apiClient.get(`/proposals/${id}/`),
  getStats: () => apiClient.get('/proposals/stats/'),
  getOpenInUpwork: (id) => apiClient.get(`/proposals/${id}/open-in-upwork/`),
} 