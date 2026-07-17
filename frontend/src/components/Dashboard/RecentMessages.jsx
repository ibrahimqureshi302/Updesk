import React from "react"

import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { Chat as ChatIcon, ArrowForward as ArrowIcon } from '@mui/icons-material'

export default function RecentMessages({ messages }) {
  const navigate = useNavigate()

  return (
    <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Card header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #F59E0B, #EF4444)' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
            Recent Messages
          </Typography>
        </Box>
        <Button
          size="small"
          endIcon={<ArrowIcon sx={{ fontSize: '13px !important' }} />}
          onClick={() => navigate('/messages')}
          sx={{ fontSize: '0.78rem', color: 'primary.main', px: 1, py: 0.25, minWidth: 0 }}
        >
          View All
        </Button>
      </Box>
      <Divider />

      {/* List */}
      {(!messages || messages.length === 0) ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">No messages found</Typography>
        </Box>
      ) : (
        <List dense disablePadding sx={{ flex: 1, overflowY: 'auto', px: 0.75, py: 0.5 }}>
          {messages.slice(0, 3).map((thread) => (
            <ListItemButton
              key={thread.id}
              onClick={() => navigate(`/messages/${thread.id}`)}
              sx={{ borderRadius: 2, px: 1.25, py: 0.75, mb: 0.25 }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Badge color="error" variant="dot" invisible={!thread.unread_count} overlap="circular">
                  <Avatar
                    sx={{
                      width: 30, height: 30, fontSize: 13,
                      background: thread.unread_count > 0
                        ? 'linear-gradient(135deg, #3B6BE4, #7C3AED)'
                        : 'linear-gradient(135deg, #94A3B8, #64748B)',
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" noWrap sx={{ fontWeight: thread.unread_count > 0 ? 700 : 500, fontSize: '0.82rem' }}>
                    {thread.contract_title || 'Unknown Project'}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.78rem' }}>
                    {thread.last_preview || 'No messages yet'}
                  </Typography>
                }
                sx={{ my: 0 }}
              />
              {thread.unread_count > 0 && (
                <Box sx={{
                  ml: 0.5, flexShrink: 0,
                  bgcolor: 'error.main', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.78rem', fontWeight: 700,
                }}>
                  {thread.unread_count}
                </Box>
              )}
            </ListItemButton>
          ))}
        </List>
      )}
    </Paper>
  )
}
