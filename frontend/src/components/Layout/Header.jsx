import React from "react"

import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Sync as SyncIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { useSync } from '../../hooks/useSync'
import { useNavigate, useLocation } from 'react-router-dom'
import NotificationBell from '../Notifications/NotificationBell'

const drawerWidth = 280

const PAGE_META = {
  '/dashboard':  { label: 'Dashboard',  emoji: '⚡' },
  '/clients':    { label: 'Clients',    emoji: '👥' },
  '/projects':   { label: 'Projects',   emoji: '💼' },
  '/messages':   { label: 'Messages',   emoji: '💬' },
  '/proposals':  { label: 'Proposals',  emoji: '📋' },
  '/profile':    { label: 'Profile',    emoji: '👤' },
  '/settings':   { label: 'Settings',   emoji: '⚙️' },
}

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    borderRadius: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing:   theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width:      `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing:   theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    [theme.breakpoints.down('sm')]: {
      width:      '100%',
      marginLeft: 0,
    },
  })
)

export default function Header({ open, handleDrawerToggle }) {
  const { user, logout }        = useAuth()
  const { triggerSync, isSyncing } = useSync()
  const navigate                = useNavigate()
  const { pathname }            = useLocation()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const pageMeta  = PAGE_META[pathname] || { label: 'Dashboard', emoji: '⚡' }
  const initials  = user?.username?.charAt(0).toUpperCase() || 'U'

  const handleMenuClose = () => setAnchorEl(null)
  const handleNavigate  = (path) => { handleMenuClose(); navigate(path) }
  const handleLogout    = () => { handleMenuClose(); logout() }

  return (
    <AppBar position="fixed" open={open} elevation={0}>
      <Toolbar sx={{ gap: { xs: 0.75, sm: 1.5 }, px: { xs: 1.5, sm: 2 } }}>

        {/* Hamburger (shown only when sidebar is closed) */}
        {!open && (
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 0.5, '&:hover': { background: 'rgba(255,255,255,0.08)' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Brand + breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
          <Typography sx={{
            fontWeight: 800, fontSize: '1.1rem', lineHeight: 1, userSelect: 'none',
            background: 'linear-gradient(90deg, #93C5FD 0%, #C4B5FD 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            display: { xs: 'none', sm: 'block' },
            flexShrink: 0,
          }}>
            UpDesk
          </Typography>

          <ChevronRightIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.2)', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
            <Box sx={{
              px: 1.25, py: 0.25, borderRadius: '8px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: 0.5,
              minWidth: 0,
            }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {pageMeta.label}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Sync button */}
        <Tooltip title={isSyncing ? 'Syncing…' : 'Sync Now'} arrow>
          <span>
            <IconButton
              color="inherit"
              onClick={triggerSync}
              disabled={isSyncing}
              sx={{
                width: 36, height: 36,
                flexShrink: 0,
                background: isSyncing ? 'rgba(59,107,228,0.2)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(59,107,228,0.25)' },
                '&:disabled': { opacity: 0.6 },
              }}
            >
              <SyncIcon sx={{ fontSize: 18, animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Notification bell */}
        <NotificationBell />

        {/* Avatar menu */}
        <Tooltip title={user?.username || 'Account'} arrow>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
            <Avatar sx={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #3B6BE4 0%, #7C3AED 100%)',
              fontSize: '0.875rem', fontWeight: 700,
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: '0 0 0 2px rgba(59,107,228,0.35)',
            }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { elevation: 3, sx: { mt: 1, minWidth: 180 } } }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">Freelancer</Typography>
          </Box>
          <Divider sx={{ mx: 1 }} />
          <MenuItem onClick={() => handleNavigate('/profile')}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 18, color: 'primary.main' }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/settings')}>
            <SettingsIcon sx={{ mr: 1.5, fontSize: 18, color: 'secondary.main' }} /> Settings
          </MenuItem>
          <Divider sx={{ mx: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Logout
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  )
}
