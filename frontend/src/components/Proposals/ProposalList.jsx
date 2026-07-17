import React, { useState } from "react"

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Search as SearchIcon, MoreVert as MoreVertIcon, Visibility as VisibilityIcon, Link as LinkIcon } from '@mui/icons-material'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters'
import { proposalsAPI } from '../../api/proposals'
import toast from 'react-hot-toast'

export default function ProposalList({ proposals, loading, onPageChange, onSearch, onStatusFilter, totalCount, page, pageSize }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const handleMenuOpen = (event, proposal) => {
    setAnchorEl(event.currentTarget)
    setSelectedProposal(proposal)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProposal(null)
  }

  const handleViewDetails = () => {
    handleMenuClose()
  }

  const handleOpenInUpwork = async () => {
    if (selectedProposal) {
      try {
        const response = await proposalsAPI.getOpenInUpwork(selectedProposal.id)
        window.open(response.data.upwork_url, '_blank')
      } catch (error) {
        toast.error('Failed to get Upwork link')
      }
    }
    handleMenuClose()
  }

  const handleStatusChange = (event) => {
    const newStatus = event.target.value
    setStatusFilter(newStatus)
    onStatusFilter(newStatus)
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading proposals...</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search proposals by job title..."
          onChange={(e) => onSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, width: { xs: '100%', sm: 'auto' } }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="SUBMITTED">Submitted</MenuItem>
            <MenuItem value="VIEWED">Viewed</MenuItem>
            <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
            <MenuItem value="INTERVIEWING">Interviewing</MenuItem>
            <MenuItem value="WON">Won</MenuItem>
            <MenuItem value="DECLINED">Declined</MenuItem>
            <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Bid Amount</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography py={4}>No proposals found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              proposals.map((proposal) => (
                <TableRow key={proposal.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {proposal.job_title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(proposal.status)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(proposal.status),
                        color: '#fff',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600} color="primary.main">
                      {formatCurrency(proposal.bid_amount, proposal.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(proposal.submitted_at)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, proposal)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageChange(1, parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          overflowX: 'auto',
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            rowGap: 1,
          },
        }}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleOpenInUpwork}>
          <LinkIcon fontSize="small" sx={{ mr: 1 }} /> Open in Upwork
        </MenuItem>
      </Menu>
    </Paper>
  )
}