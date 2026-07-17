import React from "react"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clients',   path: '/clients'   },
  { label: 'Projects',  path: '/projects'  },
  { label: 'Messages',  path: '/messages'  },
  { label: 'Proposals', path: '/proposals' },
]

const INFO_LINKS = [
  { label: 'Profile',   path: '/profile'  },
  { label: 'Settings',  path: '/settings' },
]

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        background: 'linear-gradient(135deg, #0F172A 0%, #1E2552 100%)',
        color: 'rgba(255,255,255,0.75)',
        borderTop: '3px solid transparent',
        borderImage: 'linear-gradient(90deg, #3B82F6, #8B5CF6) 1',
      }}
    >
      <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
        <Grid container spacing={4} alignItems="flex-start">

          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              {/* Gradient icon badge */}
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 16, lineHeight: 1 }}>U</Typography>
              </Box>
              <Typography sx={{
                fontWeight: 800, fontSize: '1.25rem', lineHeight: 1,
                background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                UpDesk
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 260, fontSize: '0.8rem' }}>
              Your all-in-one Upwork management dashboard. Track clients, projects, earnings, and proposals in one place.
            </Typography>
            <Chip
              label="WORK • MANAGE • GROW"
              size="small"
              sx={{
                mt: 2, fontSize: '0.78rem', letterSpacing: '0.12em',
                fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
              }}
            />
          </Grid>

          {/* Navigation column */}
          <Grid item xs={6} md={2}>
            <Typography variant="caption" sx={{
              display: 'block', mb: 1.5,
              color: 'rgba(255,255,255,0.3)', fontWeight: 700,
              fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Navigation
            </Typography>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                component="button"
                onClick={() => navigate(link.path)}
                underline="none"
                sx={{
                  display: 'block', mb: 1,
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.8rem',
                  transition: 'color 0.15s',
                  background: 'none', border: 'none', cursor: 'pointer', p: 0, textAlign: 'left',
                  '&:hover': { color: '#7EB3FF' },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Grid>

          {/* Account column */}
          <Grid item xs={6} md={2}>
            <Typography variant="caption" sx={{
              display: 'block', mb: 1.5,
              color: 'rgba(255,255,255,0.3)', fontWeight: 700,
              fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Account
            </Typography>
            {INFO_LINKS.map(link => (
              <Link
                key={link.path}
                component="button"
                onClick={() => navigate(link.path)}
                underline="none"
                sx={{
                  display: 'block', mb: 1,
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.8rem',
                  transition: 'color 0.15s',
                  background: 'none', border: 'none', cursor: 'pointer', p: 0, textAlign: 'left',
                  '&:hover': { color: '#7EB3FF' },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Grid>

          {/* Status column */}
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{
              display: 'block', mb: 1.5,
              color: 'rgba(255,255,255,0.3)', fontWeight: 700,
              fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'Upwork API Sync',  color: '#10B981' },
                { label: 'Data Encryption',  color: '#10B981' },
                { label: 'JWT Auth',          color: '#10B981' },
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.color, flexShrink: 0,
                    boxShadow: `0 0 6px ${item.color}` }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom bar */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
      <Box sx={{
        px: { xs: 3, md: 5 }, py: 1.5,
        display: 'flex', flexWrap: 'wrap', gap: 1,
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
          © {year} UpDesk. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {['Privacy Policy', 'Terms of Service'].map(text => (
            <Link key={text} href="#" underline="hover"
              sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', '&:hover': { color: '#7EB3FF' } }}>
              {text}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
