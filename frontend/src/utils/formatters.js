import { format } from 'date-fns'

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'N/A'
  return format(new Date(date), formatStr)
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM dd, yyyy h:mm a')
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const getStatusColor = (status) => {
  const colors = {
    active: '#4caf50',
    completed: '#2196f3',
    cancelled: '#f44336',
    pending: '#ff9800',
    viewed: '#2196f3',
    shortlisted: '#9c27b0',
    interviewing: '#ff9800',
    won: '#4caf50',
    declined: '#f44336',
    withdrawn: '#757575',
  }
  return colors[status?.toLowerCase()] || '#9e9e9e'
}

export const getStatusLabel = (status) => {
  const labels = {
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending: 'Pending',
    viewed: 'Viewed',
    shortlisted: 'Shortlisted',
    interviewing: 'Interviewing',
    won: 'Won',
    declined: 'Declined',
    withdrawn: 'Withdrawn',
  }
  return labels[status?.toLowerCase()] || status
}