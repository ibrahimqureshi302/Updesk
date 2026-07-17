import React from 'react'  // Add this import
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { syncAPI } from '../api/sync'
import toast from 'react-hot-toast'

export const useSyncStatus = () => {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: () => syncAPI.getStatus(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

export const useSyncHistory = (params) => {
  return useQuery({
    queryKey: ['sync-history', params],
    queryFn: () => syncAPI.getHistory(params),
  })
}

export const useSync = () => {
  const queryClient = useQueryClient()
  const [isSyncing, setIsSyncing] = React.useState(false)

  const triggerSync = async () => {
    setIsSyncing(true)
    let interval
    try {
      await syncAPI.triggerSync()
      toast.success('Sync started successfully')
      interval = setInterval(async () => {
        try {
          const status = await syncAPI.getStatus()
          const allComplete = Object.values(status.data).every(
            s => s?.status === 'SUCCESS' || s?.status === 'ERROR'
          )
          if (allComplete) {
            clearInterval(interval)
            setIsSyncing(false)
            queryClient.invalidateQueries({ queryKey: ['sync-status'] })
            queryClient.invalidateQueries({ queryKey: ['clients'] })
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['messages'] })
            queryClient.invalidateQueries({ queryKey: ['proposals'] })
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Sync completed')
          }
        } catch {
          clearInterval(interval)
          setIsSyncing(false)
        }
      }, 2000)
    } catch (error) {
      toast.error('Failed to start sync')
      setIsSyncing(false)
    }
  }

  return { triggerSync, isSyncing }
}