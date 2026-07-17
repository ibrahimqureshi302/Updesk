import React, { useState } from "react"

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Grid,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Link as LinkIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters'
import { proposalsAPI } from '../../api/proposals'
import toast from 'react-hot-toast'

export default function ProposalCard({ proposal, onUpdate }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpenDetails = () => {
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
  }

  const handleOpenInUpwork = async () => {
    setLoading(true)
    try {
      const response = await proposalsAPI.getOpenInUpwork(proposal.id)
      window.open(response.data.upwork_url, '_blank')
    } catch (error) {
      toast.error('Failed to open proposal on Upwork')
    } finally {
      setLoading(false)
    }
  }

  const getStatusMessage = (status) => {
    const messages = {
      SUBMITTED: 'Your proposal has been submitted and is waiting to be viewed',
      VIEWED: 'The client has viewed your proposal',
      SHORTLISTED: 'Great! You have been shortlisted for this position',
      INTERVIEWING: 'The client has requested an interview',
      WON: 'Congratulations! You won this project',
      DECLINED: 'The client has declined your proposal',
      WITHDRAWN: 'You have withdrawn this proposal',
    }
    return messages[status] || 'Status unknown'
  }

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="start" gap={1} mb={2}>
            <Typography variant="h6" noWrap sx={{ flex: 1, minWidth: 0 }}>
              {proposal.job_title}
            </Typography>
            <Chip
              label={getStatusLabel(proposal.status)}
              size="small"
              sx={{
                bgcolor: getStatusColor(proposal.status),
                color: '#fff',
                ml: 1,
              }}
            />
          </Box>

          <Box mb={2}>
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={1}>
              <Box display="flex" alignItems="center">
                <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {formatCurrency(proposal.bid_amount, proposal.currency)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {formatDate(proposal.submitted_at)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" display="block">
            {getStatusMessage(proposal.status)}
          </Typography>

          {proposal.cover_letter && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                Cover Letter Preview:
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {proposal.cover_letter.substring(0, 100)}...
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button size="small" onClick={handleOpenDetails}>
            View Details
          </Button>
          <Button
            size="small"
            startIcon={<LinkIcon />}
            onClick={handleOpenInUpwork}
            disabled={loading}
          >
            Open in Upwork
          </Button>
        </CardActions>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography variant="h6">Proposal Details</Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Job Title
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {proposal.job_title}
            </Typography>
          </Box>

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bid Amount
              </Typography>
              <Typography variant="h6" color="primary.main">
                {formatCurrency(proposal.bid_amount, proposal.currency)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Submitted Date
              </Typography>
              <Typography variant="body1">
                {formatDate(proposal.submitted_at)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip
                label={getStatusLabel(proposal.status)}
                size="small"
                sx={{
                  bgcolor: getStatusColor(proposal.status),
                  color: '#fff',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Job ID
              </Typography>
              <Typography variant="body2">
                {proposal.job_upwork_id || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cover Letter
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: '#fafafa',
                maxHeight: 300,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              <Typography variant="body2">
                {proposal.cover_letter || 'No cover letter provided'}
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status Message
            </Typography>
            <Alert severity="info" sx={{ mt: 1 }}>
              {getStatusMessage(proposal.status)}
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={handleOpenInUpwork}
            disabled={loading}
          >
            Open in Upwork
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}