import React from "react"

import {
  Paper,
  Grid,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  Email as EmailIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function Profile({ profile }) {
  if (!profile) return null

  const jssScore = profile.job_success_score || 0

  return (
    <Grid container spacing={3}>
      {/* Profile Header */}
      <Grid item xs={12}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Box display="flex" alignItems="center" gap={{ xs: 2, sm: 3 }} flexWrap="wrap">
            <Avatar
              sx={{
                width: { xs: 72, sm: 100 },
                height: { xs: 72, sm: 100 },
                bgcolor: '#14a800',
                fontSize: { xs: 32, sm: 48 },
              }}
            >
              {profile.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box flex={1} minWidth={0} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant="h4" gutterBottom sx={{ wordBreak: 'break-word' }}>
                {profile.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Chip icon={<EmailIcon />} label={profile.email} size="small" />
                <Chip icon={<WorkIcon />} label={`${profile.total_jobs || 0} Jobs`} size="small" />
                <Chip
                  icon={<StarIcon />}
                  label={`${jssScore}% JSS`}
                  size="small"
                  color={jssScore >= 90 ? 'success' : jssScore >= 70 ? 'warning' : 'error'}
                />
                {profile.profile_url && (
                  <Chip
                    icon={<LinkIcon />}
                    label="Profile Link"
                    size="small"
                    component="a"
                    href={profile.profile_url}
                    target="_blank"
                    clickable
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Earnings
          </Typography>
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {formatCurrency(profile.total_earnings, profile.currency)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Hourly Rate
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {formatCurrency(profile.hourly_rate, profile.currency)}/hr
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Connects Balance
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {profile.connects_balance || 0}
          </Typography>
        </Paper>
      </Grid>

      {/* About Section */}
      <Grid item xs={12} sm={12} md={8}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>
            About Me
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {profile.description || 'No description provided'}
          </Typography>

          {profile.skills?.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Skills
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {profile.skills.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Details Section */}
      <Grid item xs={12} sm={12} md={4}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {formatDate(profile.member_since)}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Job Success Score
            </Typography>
            <LinearProgress
              variant="determinate"
              value={jssScore}
              sx={{ height: 8, borderRadius: 4, mb: 1 }}
              color={jssScore >= 90 ? 'success' : jssScore >= 70 ? 'warning' : 'error'}
            />
            <Typography variant="caption" color="text.secondary">
              {jssScore}% - {jssScore >= 90 ? 'Excellent' : jssScore >= 70 ? 'Good' : 'Needs Improvement'}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}