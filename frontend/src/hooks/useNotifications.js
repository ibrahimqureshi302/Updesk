import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsAPI } from '../api/notifications'
import toast from 'react-hot-toast'

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn:  () => notificationsAPI.list(),
    refetchInterval: 30_000,
  })
}

export const useMarkAllRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => notificationsAPI.markRead(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useWhatsAppSettings = () => {
  return useQuery({
    queryKey: ['whatsapp-settings'],
    queryFn:  () => notificationsAPI.getWhatsAppSettings(),
  })
}

export const useUpdateWhatsAppSettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => notificationsAPI.updateWhatsAppSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['whatsapp-settings'] })
      toast.success('WhatsApp settings saved')
    },
    onError: () => toast.error('Failed to save WhatsApp settings'),
  })
}

export const useWhatsAppStatus = () => {
  return useQuery({
    queryKey: ['whatsapp-status'],
    queryFn:  () => notificationsAPI.getWhatsAppStatus(),
    refetchInterval: (query) => {
      const state = query.state.data?.state
      return state === 'open' ? false : 5_000
    },
  })
}

export const useSendTestWhatsApp = () => {
  return useMutation({
    mutationFn: (data) => notificationsAPI.sendTestWhatsApp(data),
    onSuccess: (data) => toast.success(`Test message sent to ${data.to}`),
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to send test message'
      const isNoPhone = err?.response?.status === 400
      toast.error(isNoPhone ? 'No phone number saved — go to Settings → WhatsApp to add one.' : msg)
    },
  })
}
