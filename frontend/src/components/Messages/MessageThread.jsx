import React, { useEffect, useRef } from "react"

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  Button,
  IconButton,
} from '@mui/material'
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material'
import { formatDateTime } from '../../utils/formatters'

export default function MessageThread({ thread, onOpenInUpwork }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages])

  if (!thread) {
    return (
      <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Select a conversation to view messages
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
          {thread.contract_title}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          onClick={onOpenInUpwork}
        >
          Open in Upwork
        </Button>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {thread.messages?.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={4}>
            No messages in this conversation
          </Typography>
        ) : (
          thread.messages?.map((message, index) => {
            const isOwn = message.sender_name?.toLowerCase().includes('you')
            return (
              <Box
                key={message.id || index}
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: '88%', sm: '70%' },
                    display: 'flex',
                    flexDirection: isOwn ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: isOwn ? '#14a800' : '#757575', flexShrink: 0 }}>
                    {message.sender_name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: isOwn ? '#14a800' : '#f5f5f5',
                        color: isOwn ? '#fff' : 'inherit',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {message.body}
                      </Typography>
                    </Paper>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {formatDateTime(message.sent_at)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Note: No composer - messages are read-only */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: '#fafafa', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Messages are read-only. Click "Open in Upwork" to reply directly on Upwork.
        </Typography>
      </Box>
    </Paper>
  )
}