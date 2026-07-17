import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsAPI } from '../api/clients'
import toast from 'react-hot-toast'

export const useClients = (params) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientsAPI.getClients(params),
  })
}

export const useClient = (id) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsAPI.getClient(id),
    enabled: !!id,
  })
}

export const useUpdateClientNotes = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, notes }) => clientsAPI.updateClientNotes(id, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['client', variables.id])
      queryClient.invalidateQueries(['clients'])
      toast.success('Client notes updated successfully')
    },
    onError: () => {
      toast.error('Failed to update client notes')
    },
  })
}