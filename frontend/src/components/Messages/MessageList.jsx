import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Badge, Typography, Box, Paper,
} from '@mui/material'
import { Chat as ChatIcon } from '@mui/icons-material'
import { formatDate } from '../../utils/formatters'
import SearchWithSuggestions from '../Common/SearchWithSuggestions'

export default function MessageList({ threads, onSearch, selectedId }) {
  const navigate = useNavigate()

  const suggestions = threads.map((t) => ({
    label:    t.contract_title || 'Unknown Project',
    sublabel: t.last_preview   || '',
    value:    t.contract_title || '',
  }))

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ p: 2 }}>
        <SearchWithSuggestions
          placeholder="Search messages..."
          suggestions={suggestions}
          onCommit={onSearch}
          onClear={() => onSearch('')}
          size="small"
          icon={<ChatIcon fontSize="small" />}
        />
      </Box>

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {threads.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="text.secondary">No messages found</Typography>
          </Box>
        ) : (
          threads.map((thread) => (
            <ListItem
              key={thread.id}
              button
              selected={selectedId === thread.id}
              onClick={() => navigate(`/messages/${thread.id}`)}
              sx={{ '&.Mui-selected': { bgcolor: 'rgba(20, 168, 0, 0.1)' } }}
            >
              <ListItemAvatar sx={{ minWidth: { xs: 44, sm: 56 } }}>
                <Badge
                  color="error"
                  variant="dot"
                  invisible={thread.unread_count === 0}
                  overlap="circular"
                >
                  <Avatar sx={{ bgcolor: thread.unread_count > 0 ? '#14a800' : '#757575' }}>
                    <ChatIcon />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{ minWidth: 0 }}
                primary={
                  <Typography
                    variant="body2"
                    fontWeight={thread.unread_count > 0 ? 600 : 400}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {thread.contract_title || 'Unknown Project'}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: '100%' }}
                    >
                      {thread.last_preview || 'No messages yet'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(thread.last_synced_at)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  )
}