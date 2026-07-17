import React, { useState } from "react"

import {
  Paper,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  Link as LinkIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { clientsAPI } from '../../api/clients'
import toast from 'react-hot-toast'

export default function ClientDetail({ client, onUpdate }) {
  const [editNotesOpen, setEditNotesOpen] = useState(false)
  const [notes, setNotes] = useState(client?.notes || '')

  const handleSaveNotes = async () => {
    try {
      await clientsAPI.updateClientNotes(client.id, { notes })
      toast.success('Notes updated successfully')
      onUpdate()
      setEditNotesOpen(false)
    } catch (error) {
      toast.error('Failed to update notes')
    }
  }

  if (!client) return null

  return (
    <>
      <Grid container spacing={3}>
        {/* Client Info Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#14a800', width: 56, height: 56, mr: 2 }}>
                <BusinessIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {client.name || `${client.first_name} ${client.last_name}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Client since {formatDate(client.created_at)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              {client.company_name && (
                <Box display="flex" alignItems="center" mb={1.5}>
                  <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{client.company_name}</Typography>
                </Box>
              )}
              {client.email && (
                <Box display="flex" alignItems="center" mb={1.5}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{client.email}</Typography>
                </Box>
              )}
              {client.country && (
                <Box display="flex" alignItems="center" mb={1.5}>
                  <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{client.country}</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Statistics
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {formatCurrency(client.total_spent || 0)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Total Contracts</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {client.total_contracts || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Last Synced</Typography>
                <Typography variant="caption">
                  {formatDate(client.last_synced_at)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Notes Card */}
        <Grid item xs={12} sm={6} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
              mb={2}
            >
              <Typography variant="h6">Private Notes</Typography>
              <Button startIcon={<EditIcon />} onClick={() => setEditNotesOpen(true)}>
                Edit Notes
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {client.notes || 'No notes added yet. Click Edit Notes to add private notes about this client.'}
            </Typography>
          </Paper>
        </Grid>

        {/* Projects Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Projects & Contracts
            </Typography>
            {client.projects?.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No projects found for this client
              </Typography>
            ) : (
              <List>
                {client.projects?.map((project) => (
                  <ListItem
                    key={project.id}
                    divider
                    sx={{ flexWrap: 'wrap', gap: 1, alignItems: { xs: 'flex-start', sm: 'center' } }}
                  >
                    <ListItemText
                      sx={{ minWidth: 0 }}
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word' }}>
                            {project.title}
                          </Typography>
                          <Chip
                            label={project.status}
                            size="small"
                            color={project.status === 'active' ? 'success' : 'default'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box mt={0.5}>
                          <Typography variant="caption" display="block">
                            Started: {formatDate(project.start_date)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Value: {formatCurrency(project.total_earned, project.currency)}
                          </Typography>
                        </Box>
                      }
                    />
                    {project.upwork_url && (
                      <Button
                        size="small"
                        startIcon={<LinkIcon />}
                        href={project.upwork_url}
                        target="_blank"
                        sx={{ ml: { xs: 0, sm: 'auto' } }}
                      >
                        View on Upwork
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Notes Dialog */}
      <Dialog open={editNotesOpen} onClose={() => setEditNotesOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Client Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this client..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNotesOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}