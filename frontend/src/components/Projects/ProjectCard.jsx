import React from "react"

import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Chip, CardActions, Button, LinearProgress } from '@mui/material'
import { Work as WorkIcon, AttachMoney as MoneyIcon } from '@mui/icons-material'
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const progress = project.milestones?.filter(m => m.status === 'approved').length / project.milestones?.length * 100 || 0

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={1} mb={2}>
          <Typography variant="h6" noWrap sx={{ minWidth: 0, flexShrink: 1 }}>
            {project.title}
          </Typography>
          <Chip
            label={getStatusLabel(project.status)}
            size="small"
            sx={{
              bgcolor: getStatusColor(project.status),
              color: '#fff',
            }}
          />
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Client: {project.client_name || 'Unknown'}
          </Typography>
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center">
              <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2">{project.contract_type}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2">{formatCurrency(project.total_earned || 0)}</Typography>
            </Box>
          </Box>
        </Box>

        {project.milestones?.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Milestones Progress
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.5, height: 6, borderRadius: 3 }} />
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => navigate(`/projects/${project.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}