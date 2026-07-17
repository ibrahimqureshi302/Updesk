import React from "react"

import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { ArrowForward as ArrowIcon } from '@mui/icons-material'
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters'

export default function RecentProjects({ projects }) {
  const navigate = useNavigate()

  return (
    <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Card header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #059669, #10B981)' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
            Recent Projects
          </Typography>
        </Box>
        <Button
          size="small"
          endIcon={<ArrowIcon sx={{ fontSize: '13px !important' }} />}
          onClick={() => navigate('/projects')}
          sx={{ fontSize: '0.78rem', color: 'primary.main', px: 1, py: 0.25, minWidth: 0 }}
        >
          View All
        </Button>
      </Box>
      <Divider />

      {/* List */}
      {(!projects || projects.length === 0) ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">No projects found</Typography>
        </Box>
      ) : (
        <List dense disablePadding sx={{ flex: 1, overflowY: 'auto', px: 0.75, py: 0.5 }}>
          {projects.slice(0, 3).map((project) => (
            <ListItemButton
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{ borderRadius: 2, px: 1.25, py: 0.75, mb: 0.25 }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    {project.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.3 }}>
                    <Chip
                      label={getStatusLabel(project.status)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(project.status),
                        color: '#fff',
                        fontSize: '0.78rem',
                        height: 16,
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                      {formatCurrency(project.total_earned || 0, project.currency)}
                    </Typography>
                  </Box>
                }
                sx={{ my: 0 }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Paper>
  )
}
