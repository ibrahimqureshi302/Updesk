import React from "react"

import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TrendingUp, TrendingDown } from '@mui/icons-material'

const GRADIENTS = {
  primary: 'linear-gradient(135deg, #3B6BE4 0%, #7C3AED 100%)',
  success: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  info:    'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
  warning: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
  error:   'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
}

const SOFT_BG = {
  primary: 'rgba(59,107,228,0.10)',
  success: 'rgba(16,185,129,0.10)',
  info:    'rgba(59,130,246,0.10)',
  warning: 'rgba(245,158,11,0.10)',
  error:   'rgba(239,68,68,0.10)',
}

const ICON_COLOR = {
  primary: '#3B6BE4',
  success: '#10B981',
  info:    '#3B82F6',
  warning: '#F59E0B',
  error:   '#EF4444',
}

export default function StatCard({ title, value, icon: Icon, color = 'primary', trend, trendValue }) {
  const gradient = GRADIENTS[color] || GRADIENTS.primary

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1.75,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        background: '#fff',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 28px rgba(59,107,228,0.14)',
        },
        /* gradient top accent bar */
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: gradient,
          borderRadius: '16px 16px 0 0',
        },
        /* subtle diagonal glow */
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -30, right: -30,
          width: 90, height: 90,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${SOFT_BG[color] || 'rgba(59,107,228,0.06)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Left: label + value + trend */}
      <Box sx={{ zIndex: 1 }}>
        <Typography
          variant="caption"
          sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.78rem' }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800, lineHeight: 1, mb: 0.5,
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </Typography>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            {trend === 'up'
              ? <TrendingUp  sx={{ fontSize: 12, color: 'success.main' }} />
              : <TrendingDown sx={{ fontSize: 12, color: 'error.main'  }} />
            }
            <Typography
              variant="caption"
              sx={{ fontSize: '0.78rem', fontWeight: 600, color: trend === 'up' ? 'success.main' : 'error.main' }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right: gradient icon circle */}
      <Box
        sx={{
          zIndex: 1, flexShrink: 0,
          width: 44, height: 44,
          borderRadius: '14px',
          background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${SOFT_BG[color] ? SOFT_BG[color].replace('0.10', '0.4') : 'rgba(59,107,228,0.3)'}`,
        }}
      >
        <Icon sx={{ color: '#fff', fontSize: 22 }} />
      </Box>
    </Paper>
  )
}
