import React from "react"

import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Chip, Avatar, CardActions, Button } from '@mui/material'
import { Business as BusinessIcon, LocationOn as LocationIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import { formatCurrency } from '../../utils/formatters'

export default function ClientCard({ client }) {
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#14a800', mr: 2 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" noWrap>
              {client.name || `${client.first_name} ${client.last_name}`}
            </Typography>
            {client.company_name && (
              <Typography variant="caption" color="text.secondary">
                {client.company_name}
              </Typography>
            )}
          </Box>
        </Box>

        <Box mb={2}>
          {client.country && (
            <Box display="flex" alignItems="center" mb={1}>
              <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{client.country}</Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center">
            <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              Total Spent: <strong>{formatCurrency(client.total_spent || 0)}</strong>
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip label={`${client.total_contracts || 0} Contracts`} size="small" />
          <Chip label={`${client.total_reviews || 0} Reviews`} size="small" variant="outlined" />
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => navigate(`/clients/${client.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}