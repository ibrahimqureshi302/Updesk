
import { useQuery } from '@tanstack/react-query'
import { messagesAPI } from '../api/messages'

export const useMessageThreads = (params) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesAPI.getThreads(params),
  })
}

export const useMessageThread = (id) => {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => messagesAPI.getThread(id),
    enabled: !!id,
  })
}