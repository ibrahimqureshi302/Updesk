import React from "react"

import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Alert } from '@mui/material'
import { profileAPI } from '../api/profile'
import ProfileComponent from '../components/Profile/Profile'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Profile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileAPI.getProfile(),
    retry: false, // Don't retry on 404
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !data?.data) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          My Profile
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Profile data not available yet. Please connect your Upwork account to view your profile.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        My Profile
      </Typography>
      <ProfileComponent profile={data?.data} />
    </Box>
  )
}