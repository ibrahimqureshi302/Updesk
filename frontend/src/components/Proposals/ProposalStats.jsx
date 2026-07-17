import React from "react"

import { Paper, Grid, Typography, Box, LinearProgress, Divider } from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

const STATUS_COLORS = {
  SUBMITTED:    '#3B6BE4',
  VIEWED:       '#10B981',
  SHORTLISTED:  '#7C3AED',
  INTERVIEWING: '#F59E0B',
  WON:          '#059669',
  DECLINED:     '#EF4444',
  WITHDRAWN:    '#94A3B8',
}

const STATUS_ICONS = {
  SUBMITTED:    <VisibilityIcon  sx={{ fontSize: 13 }} />,
  VIEWED:       <CheckCircleIcon sx={{ fontSize: 13 }} />,
  SHORTLISTED:  <StarIcon        sx={{ fontSize: 13 }} />,
  INTERVIEWING: <TrendingUpIcon  sx={{ fontSize: 13 }} />,
  WON:          <CheckCircleIcon sx={{ fontSize: 13 }} />,
  DECLINED:     <WarningIcon     sx={{ fontSize: 13 }} />,
  WITHDRAWN:    <WarningIcon     sx={{ fontSize: 13 }} />,
}

const STATUS_LABELS = {
  SUBMITTED: 'Submitted', VIEWED: 'Viewed', SHORTLISTED: 'Shortlisted',
  INTERVIEWING: 'Interviewing', WON: 'Won', DECLINED: 'Declined', WITHDRAWN: 'Withdrawn',
}

export default function ProposalStats({ stats }) {
  if (!stats) {
    return (
      <Paper elevation={1} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">No proposal statistics</Typography>
      </Paper>
    )
  }

  const { total, won, win_rate, by_status } = stats
  const winPct = win_rate || 0
  const winColor = winPct >= 50 ? '#059669' : winPct >= 30 ? '#F59E0B' : '#EF4444'

  return (
    <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Box sx={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #7C3AED, #3B6BE4)' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
          Proposal Pipeline
        </Typography>
      </Box>
      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, p: 1.5 }}>

        {/* KPI row */}
        <Grid container spacing={1} sx={{ mb: 1.25 }}>
          {[
            { label: 'Total',   value: total || 0, color: '#3B6BE4' },
            { label: 'Won',     value: won   || 0, color: '#059669' },
            { label: 'Win %',   value: `${winPct}%`, color: winColor },
          ].map(({ label, value, color }) => (
            <Grid item xs={4} key={label}>
              <Box sx={{ textAlign: 'center', p: 0.75, borderRadius: 2, bgcolor: 'rgba(59,107,228,0.04)', border: '1px solid rgba(59,107,228,0.08)' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3, color, fontSize: '1.1rem' }}>
                  {value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Win rate bar */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem', fontWeight: 600 }}>Win Rate</Typography>
            <Typography variant="caption" sx={{ fontSize: '0.78rem', fontWeight: 700, color: winColor }}>{winPct}%</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(59,107,228,0.08)', overflow: 'hidden' }}>
            <Box sx={{
              height: '100%', borderRadius: 3,
              width: `${winPct}%`,
              background: `linear-gradient(90deg, ${winColor}, ${winColor}99)`,
              transition: 'width 0.8s ease',
            }} />
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Status breakdown */}
        <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          By Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {Object.entries(by_status || {}).map(([status, count]) => (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 0.4, borderRadius: 1.5, bgcolor: `${STATUS_COLORS[status] || '#64748B'}10`, border: `1px solid ${STATUS_COLORS[status] || '#64748B'}20` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ color: STATUS_COLORS[status] || '#64748B', display: 'flex' }}>
                  {STATUS_ICONS[status]}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                  {STATUS_LABELS[status] || status}
                </Typography>
              </Box>
              <Box sx={{
                minWidth: 22, height: 22, borderRadius: '6px',
                bgcolor: STATUS_COLORS[status] || '#64748B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{count}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}
