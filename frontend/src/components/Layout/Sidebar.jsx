import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Chat as ChatIcon,
  Description as ProposalIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useSyncStatus } from '../../hooks/useSync';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { text: 'Clients',   icon: <PeopleIcon   fontSize="small" />, path: '/clients'   },
  { text: 'Projects',  icon: <WorkIcon      fontSize="small" />, path: '/projects'  },
  { text: 'Messages',  icon: <ChatIcon      fontSize="small" />, path: '/messages'  },
  { text: 'Proposals', icon: <ProposalIcon  fontSize="small" />, path: '/proposals' },
  { text: 'Profile',   icon: <PersonIcon    fontSize="small" />, path: '/profile'   },
  { text: 'Settings',  icon: <SettingsIcon  fontSize="small" />, path: '/settings'  },
];

/* ──────────────────────────────────────────────
   Inline SVG logo — shown when logo.png is absent
────────────────────────────────────────────── */
function UpDeskSVGLogo() {
  return (
    <svg width="148" height="44" viewBox="0 0 148 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient>
      </defs>

      {/* U shape: left post */}
      <rect x="1" y="2" width="7" height="26" rx="3.5" fill="url(#lg)"/>
      {/* U shape: bottom arc */}
      <path d="M4.5 28 Q4.5 40 16 40 Q27.5 40 27.5 28" fill="none" stroke="url(#lg)" strokeWidth="7" strokeLinecap="round"/>
      {/* U shape: right post */}
      <rect x="24" y="14" width="7" height="16" rx="3.5" fill="url(#lg)"/>
      {/* Arrow head */}
      <path d="M21 14 L27.5 2 L34 14Z" fill="#8B5CF6"/>

      {/* "Up" */}
      <text x="44" y="30" fontFamily="Inter,system-ui,sans-serif" fontSize="24" fontWeight="800" fill="#3B82F6">Up</text>
      {/* "Desk" */}
      <text x="76" y="30" fontFamily="Inter,system-ui,sans-serif" fontSize="24" fontWeight="800" fill="#ffffff">Desk</text>
    </svg>
  )
}

export default function Sidebar({ open, drawerWidth, isMobile, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { data: syncStatus } = useSyncStatus();
  const [logoErr, setLogoErr] = React.useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const syncHealthy = React.useMemo(() => {
    if (!syncStatus) return null;
    return !Object.values(syncStatus).some(s => s?.status === 'ERROR');
  }, [syncStatus]);

  const lastSyncTime = React.useMemo(() => {
    if (!syncStatus) return 'Never';
    const latest = Object.values(syncStatus).find(s => s?.finished_at);
    if (!latest) return 'Never';
    return new Date(latest.finished_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [syncStatus]);

  return (
    <Drawer
      sx={{
        width: isMobile ? 0 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          maxWidth: '85vw',
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E2552 100%)',
          color: '#ffffff',
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        },
      }}
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      {/* ── Logo area ── */}
      <Box sx={{
        px: 3, py: 2.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        minHeight: 72,
      }}>
        {logoErr ? (
          <UpDeskSVGLogo />
        ) : (
          <Box
            component="img"
            src="/logo.png"
            alt="UpDesk"
            onError={() => setLogoErr(true)}
            sx={{ height: 44, width: 'auto', maxWidth: 160, objectFit: 'contain' }}
          />
        )}

        {/* Sync status dot */}
        {syncHealthy !== null && (
          <Tooltip title={syncHealthy ? 'All systems OK' : 'Sync error'}>
            <Box sx={{
              width: 10, height: 10, borderRadius: '50%',
              bgcolor: syncHealthy ? '#10B981' : '#EF4444',
              boxShadow: syncHealthy
                ? '0 0 8px rgba(16,185,129,0.7)'
                : '0 0 8px rgba(239,68,68,0.7)',
              flexShrink: 0,
            }} />
          </Tooltip>
        )}
      </Box>

      {/* ── User card ── */}
      <Box sx={{
        mx: 2, my: 2, p: 2,
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Avatar sx={{
          width: 44, height: 44, flexShrink: 0,
          background: 'linear-gradient(135deg, #3B6BE4 0%, #7C3AED 100%)',
          fontSize: 18, fontWeight: 700,
          border: '2px solid rgba(255,255,255,0.15)',
        }}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3, color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
            Freelancer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
            <DotIcon sx={{ fontSize: 8, color: '#10B981' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
              Synced {lastSyncTime}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="caption" sx={{
        px: 3, mb: 0.5,
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Navigation
      </Typography>

      {/* ── Menu items ── */}
      <List sx={{ px: 1.5, pb: 0 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  background: active
                    ? 'linear-gradient(135deg, rgba(59,107,228,0.22) 0%, rgba(124,58,237,0.18) 100%)'
                    : 'transparent',
                  border: active ? '1px solid rgba(59,107,228,0.3)' : '1px solid transparent',
                  /* left accent bar on active */
                  '&::before': active ? {
                    content: '""',
                    position: 'absolute',
                    left: 0, top: '20%', bottom: '20%',
                    width: 3,
                    borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(180deg, #7EB3FF, #C4B5FD)',
                  } : {},
                  '&:hover': {
                    background: active
                      ? 'linear-gradient(135deg, rgba(59,107,228,0.28) 0%, rgba(124,58,237,0.23) 100%)'
                      : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: active ? '#7EB3FF' : 'rgba(255,255,255,0.5)',
                  transition: 'color 0.15s',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 400,
                    color: active ? '#F1F5F9' : 'rgba(255,255,255,0.65)',
                  }}
                />
                {active && (
                  <Box sx={{
                    width: 4, height: 4, borderRadius: '50%',
                    bgcolor: '#7EB3FF', ml: 1, flexShrink: 0,
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* ── Bottom tagline ── */}
      <Box sx={{ mt: 'auto', px: 3, py: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography variant="caption" sx={{
          display: 'block', textAlign: 'center',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.78rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Work • Manage • Grow
        </Typography>
      </Box>
    </Drawer>
  );
}
