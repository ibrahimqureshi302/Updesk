import React from "react"

import { Box, Paper, Typography, Alert } from '@mui/material'
import { Info as InfoIcon } from '@mui/icons-material'

export default function MessageComposer() {
  return (
    <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
      <Alert severity="info" icon={<InfoIcon />}>
        <Typography variant="body2">
          Sending messages via API is not supported. Please use the "Open in Upwork" button
          in the message thread to reply directly on Upwork.
        </Typography>
      </Alert>
    </Paper>
  )
}