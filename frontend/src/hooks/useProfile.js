import { useQuery } from '@tanstack/react-query'
import { profileAPI } from '../api/profile'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileAPI.getProfile(),
  })
}