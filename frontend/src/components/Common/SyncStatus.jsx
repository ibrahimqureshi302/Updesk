import React from "react"

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import { CheckCircle, Error, HourglassEmpty } from '@mui/icons-material'
import { useSyncStatus } from '../../hooks/useSync'

const getStatusIcon = (status) => {
  if (!status) return <HourglassEmpty sx={{ fontSize: 16 }} />
  switch (status.status) {
    case 'SUCCESS':
      return <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
    case 'ERROR':
      return <Error sx={{ fontSize: 16, color: '#f44336' }} />
    default:
      return <HourglassEmpty sx={{ fontSize: 16 }} />
  }
}

const getStatusColor = (status) => {
  if (!status) return 'default'
  switch (status.status) {
    case 'SUCCESS':
      return 'success'
    case 'ERROR':
      return 'error'
    default:
      return 'warning'
  }
}

export default function SyncStatus() {
  const { data: syncStatus, isLoading } = useSyncStatus()

  if (isLoading || !syncStatus) {
    return null
  }

  const modules = Object.entries(syncStatus)

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Sync Status
      </Typography>
      <Grid container spacing={1}>
        {modules.map(([module, status]) => (
          <Grid item xs={12} sm={6} key={module}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 0.75, minWidth: 0 }}>
              <Typography variant="caption" sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
                {module}
              </Typography>
              <Chip
                icon={getStatusIcon(status)}
                label={status?.status || 'Pending'}
                size="small"
                color={getStatusColor(status)}
                variant="outlined"
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}