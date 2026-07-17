
import { useQuery } from '@tanstack/react-query'
import { projectsAPI } from '../api/projects'

export const useProjects = (params) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsAPI.getProjects(params),
  })
}

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getProject(id),
    enabled: !!id,
  })
}

export const useMilestones = (params) => {
  return useQuery({
    queryKey: ['milestones', params],
    queryFn: () => projectsAPI.getMilestones(params),
  })
}