import React from "react"

import {
  Paper,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Button,
} from '@mui/material'
import {
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate, getStatusLabel } from '../../utils/formatters'

export default function ProjectDetail({ project }) {
  if (!project) return null

  const progress = project.milestones?.filter(m => m.status === 'approved').length / project.milestones?.length * 100 || 0

  return (
    <Grid container spacing={3}>
      {/* Main Info Card */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={1} mb={2}>
            <Typography variant="h5" gutterBottom sx={{ minWidth: 0, wordBreak: 'break-word' }}>
              {project.title}
            </Typography>
            <Chip
              label={getStatusLabel(project.status)}
              sx={{
                bgcolor: project.status === 'active' ? '#4caf50' : '#757575',
                color: '#fff',
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Project Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Type: {project.contract_type || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <MoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Value: {formatCurrency(project.total_earned || 0, project.currency)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Started: {formatDate(project.start_date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Ends: {formatDate(project.end_date) || 'Ongoing'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {project.hourly_rate && (
            <Box mt={2}>
              <Typography variant="subtitle2">Hourly Rate</Typography>
              <Typography variant="h6" color="primary.main">
                {formatCurrency(project.hourly_rate)}/hour
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Quick Stats Card */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick Stats
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Total Earned
            </Typography>
            <Typography variant="h5" color="primary.main">
              {formatCurrency(project.total_earned || 0, project.currency)}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Milestones Progress
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          {project.upwork_url && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LinkIcon />}
              href={project.upwork_url}
              target="_blank"
            >
              View on Upwork
            </Button>
          )}
        </Paper>
      </Grid>

      {/* Milestones Card */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Milestones
          </Typography>
          {project.milestones?.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No milestones found for this project
            </Typography>
          ) : (
            <List>
              {project.milestones?.map((milestone) => (
                <ListItem key={milestone.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                        <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word' }}>
                          {milestone.title}
                        </Typography>
                        <Chip
                          label={milestone.status}
                          size="small"
                          color={milestone.status === 'approved' ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Typography variant="caption" display="block">
                          Amount: {formatCurrency(milestone.amount, milestone.currency)}
                        </Typography>
                        {milestone.due_date && (
                          <Typography variant="caption" display="block">
                            Due: {formatDate(milestone.due_date)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}