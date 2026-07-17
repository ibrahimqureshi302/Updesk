import apiClient from './client'

export const projectsAPI = {
  getProjects: (params = {}) => apiClient.get('/projects/', { params }),
  getProject: (id) => apiClient.get(`/projects/${id}/`),
  getMilestones: (params = {}) => apiClient.get('/projects/milestones/', { params }),
}