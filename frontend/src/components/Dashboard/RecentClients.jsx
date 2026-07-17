import React from "react"

import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { Business as BusinessIcon, ArrowForward as ArrowIcon } from '@mui/icons-material'

export default function RecentClients({ clients }) {
  const navigate = useNavigate()

  return (
    <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Card header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #3B6BE4, #7C3AED)' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
            Recent Clients
          </Typography>
        </Box>
        <Button
          size="small"
          endIcon={<ArrowIcon sx={{ fontSize: '13px !important' }} />}
          onClick={() => navigate('/clients')}
          sx={{ fontSize: '0.78rem', color: 'primary.main', px: 1, py: 0.25, minWidth: 0 }}
        >
          View All
        </Button>
      </Box>
      <Divider />

      {/* List */}
      {(!clients || clients.length === 0) ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">No clients found</Typography>
        </Box>
      ) : (
        <List dense disablePadding sx={{ flex: 1, overflowY: 'auto', px: 0.75, py: 0.5 }}>
          {clients.slice(0, 3).map((client) => (
            <ListItemButton
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              sx={{ borderRadius: 2, px: 1.25, py: 0.75, mb: 0.25 }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar sx={{ width: 30, height: 30, background: 'linear-gradient(135deg, #3B6BE4, #7C3AED)', fontSize: 13, fontWeight: 700 }}>
                  {(client.name || client.company_name || 'C')[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    {client.name || client.company_name || 'Unknown Client'}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.78rem' }}>
                    {client.total_contracts || 0} contracts · {client.country || 'N/A'}
                  </Typography>
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
