import React from 'react'
import {
  Badge,
  IconButton,
  Popover,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  Tooltip,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Assignment as ProposalIcon,
  Person as ClientIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useNotifications, useMarkAllRead } from '../../hooks/useNotifications'

const TYPE_META = {
  message:  { icon: <MessageIcon fontSize="small" />,  color: '#1976d2', route: '/messages' },
  proposal: { icon: <ProposalIcon fontSize="small" />, color: '#ed6c02', route: '/proposals' },
  client:   { icon: <ClientIcon fontSize="small" />,   color: '#2e7d32', route: '/clients' },
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const { data } = useNotifications()
  const markAllRead = useMarkAllRead()

  const notifications = data?.results ?? []
  const unreadCount   = data?.unread_count ?? 0

  const handleOpen  = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleNotificationClick = (notif) => {
    const meta = TYPE_META[notif.ntype] ?? {}
    handleClose()
    if (meta.route) navigate(meta.route)
  }

  const handleMarkAll = () => {
    markAllRead.mutate()
  }

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount || null} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: { xs: '92vw', sm: 380 }, maxWidth: 400, maxHeight: 520, display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications
            {unreadCount > 0 && (
              <Chip label={unreadCount} size="small" color="error" sx={{ ml: 1, height: 22, fontSize: '0.78rem' }} />
            )}
          </Typography>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={handleMarkAll}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
            {notifications.map((notif, idx) => {
              const meta = TYPE_META[notif.ntype] ?? {}
              return (
                <React.Fragment key={notif.id}>
                  <ListItemButton
                    alignItems="flex-start"
                    onClick={() => handleNotificationClick(notif)}
                    sx={{
                      bgcolor: notif.read ? 'transparent' : 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: meta.color }}>
                      {meta.icon}
                    </ListItemIcon>
                    <ListItemText
                      sx={{ minWidth: 0 }}
                      primary={
                        <Typography variant="body2" fontWeight={notif.read ? 400 : 700} noWrap>
                          {notif.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {notif.body}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {timeAgo(notif.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                    {!notif.read && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mt: 1, ml: 1, flexShrink: 0 }} />
                    )}
                  </ListItemButton>
                  {idx < notifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              )
            })}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Button size="small" onClick={() => { handleClose(); navigate('/settings') }}>
              Notification Settings
            </Button>
          </Box>
        )}
      </Popover>
    </>
  )
}
