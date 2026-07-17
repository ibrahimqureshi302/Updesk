import React from "react"

import { Box, Typography } from '@mui/material'
import SettingsComponent from '../components/Profile/Settings'

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Settings
      </Typography>
      <SettingsComponent />
    </Box>
  )
}