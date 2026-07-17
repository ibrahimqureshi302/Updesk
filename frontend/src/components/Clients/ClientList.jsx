import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Box, Typography, Chip,
  IconButton, Menu, MenuItem,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate } from '../../utils/formatters'
import SearchWithSuggestions from '../Common/SearchWithSuggestions'

export default function ClientList({
  clients, loading, onPageChange, onSearch, totalCount, page, pageSize,
}) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl]           = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const handleMenuOpen  = (e, client) => { setAnchorEl(e.currentTarget); setSelectedClient(client) }
  const handleMenuClose = ()           => { setAnchorEl(null); setSelectedClient(null) }
  const handleView      = ()           => { if (selectedClient) navigate(`/clients/${selectedClient.id}`); handleMenuClose() }
  const handleEdit      = ()           => handleMenuClose()

  // suggestions built from the current page of clients — no API call needed
  const suggestions = clients.map((c) => ({
    label:    c.name || `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || '—',
    sublabel: [c.company_name, c.country].filter(Boolean).join(' · '),
    value:    c.name || `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim(),
  }))

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading clients...</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <SearchWithSuggestions
          placeholder="Search clients by name, company or country..."
          suggestions={suggestions}
          onCommit={onSearch}
          onClear={() => onSearch('')}
          icon={<PersonIcon fontSize="small" />}
        />
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="right">Total Spent</TableCell>
              <TableCell align="center">Contracts</TableCell>
              <TableCell align="center">Last Synced</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography py={4}>No clients found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {client.name ||
                        (client.first_name || client.last_name
                          ? `${client.first_name ?? ''} ${client.last_name ?? ''}`.trim()
                          : '—')}
                    </Typography>
                  </TableCell>
                  <TableCell>{client.company_name || '—'}</TableCell>
                  <TableCell>
                    <Chip label={client.country || 'N/A'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600} color="primary.main">
                      {formatCurrency(client.total_spent || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={client.total_contracts || 0} size="small" color="info" />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption">{formatDate(client.last_synced_at)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, client)}>
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
          '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', justifyContent: 'center', rowGap: 1, py: 1 },
          '& .MuiTablePagination-spacer': { display: { xs: 'none', sm: 'block' } },
        }}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Notes
        </MenuItem>
      </Menu>
    </Paper>
  )
}