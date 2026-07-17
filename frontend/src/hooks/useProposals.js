import { useQuery } from '@tanstack/react-query'
import { proposalsAPI } from '../api/proposals'

export const useProposals = (params) => {
  return useQuery({
    queryKey: ['proposals', params],
    queryFn: () => proposalsAPI.getProposals(params),
  })
}

export const useProposalStats = () => {
  return useQuery({
    queryKey: ['proposals-stats'],
    queryFn: () => proposalsAPI.getStats(),
  })
}