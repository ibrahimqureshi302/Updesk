import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Grid, Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { messagesAPI } from '../api/messages'
import MessageList from '../components/Messages/MessageList'
import MessageThread from '../components/Messages/MessageThread'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Messages() {
  const { id }                          = useParams()
  const navigate                        = useNavigate()
  const theme                           = useTheme()
  const isMobile                        = useMediaQuery(theme.breakpoints.down('md'))
  const [committedSearch, setCommitted] = useState('')
  const queryClient                     = useQueryClient()

  const { data: threads, isLoading } = useQuery({
    queryKey: ['messages', committedSearch],
    queryFn:  () => messagesAPI.getThreads({
      search:    committedSearch || undefined,
      page_size: 50,
    }),
  })

  const { data: selectedThread, isLoading: threadLoading } = useQuery({
    queryKey: ['message', id],
    queryFn:  async () => {
      const res = await messagesAPI.getThread(id)
      // Backend resets unread_count on GET — refresh thread list so badge clears
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      return res
    },
    enabled:  !!id,
  })

  const handleSearch = (value) => setCommitted(value)

  const handleOpenInUpwork = async () => {
    if (id) {
      try {
        const response = await messagesAPI.getOpenInUpwork(id)
        window.open(response.data.upwork_url, '_blank')
      } catch {
        toast.error('Failed to get Upwork link')
      }
    }
  }

  if (isLoading) return <LoadingSpinner />

  // On mobile, show a single pane at a time: the thread list by default,
  // or the active conversation (with a back button) once a thread is selected.
  const showList   = !isMobile || !id
  const showThread = !isMobile || !!id

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Messages
      </Typography>
      <Grid container spacing={3} sx={{ height: { xs: 'calc(100vh - 180px)', md: 'calc(100vh - 200px)' } }}>
        {showList && (
          <Grid item xs={12} md={4}>
            <MessageList
              threads={threads?.data?.results || []}
              onSearch={handleSearch}
              selectedId={parseInt(id)}
            />
          </Grid>
        )}
        {showThread && (
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {isMobile && id && (
              <Box sx={{ mb: 1 }}>
                <IconButton onClick={() => navigate('/messages')} size="small" aria-label="Back to messages">
                  <ArrowBackIcon />
                </IconButton>
              </Box>
            )}
            <Box sx={{ flex: 1, minHeight: 0 }}>
              {threadLoading
                ? <LoadingSpinner />
                : <MessageThread thread={selectedThread?.data} onOpenInUpwork={handleOpenInUpwork} />
              }
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}