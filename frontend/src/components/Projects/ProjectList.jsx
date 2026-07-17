import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Box, Typography, Chip,
  IconButton, Menu, MenuItem,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Work as WorkIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters'
import SearchWithSuggestions from '../Common/SearchWithSuggestions'

export default function ProjectList({
  projects, loading, onPageChange, onSearch, totalCount, page, pageSize,
}) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl]             = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  const handleMenuOpen  = (e, project) => { setAnchorEl(e.currentTarget); setSelectedProject(project) }
  const handleMenuClose = ()            => { setAnchorEl(null); setSelectedProject(null) }
  const handleView      = ()            => { if (selectedProject) navigate(`/projects/${selectedProject.id}`); handleMenuClose() }

  const suggestions = projects.map((p) => ({
    label:    p.title,
    sublabel: [p.client_name, getStatusLabel(p.status)].filter(Boolean).join(' · '),
    value:    p.title,
  }))

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading projects...</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

      <Box sx={{ p: 2 }}>
        <SearchWithSuggestions
          placeholder="Search projects by title..."
          suggestions={suggestions}
          onCommit={onSearch}
          onClear={() => onSearch('')}
          icon={<WorkIcon fontSize="small" />}
        />
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Project Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography py={4}>No projects found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{project.title}</Typography>
                  </TableCell>
                  <TableCell>{project.client_name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(project.status)}
                      size="small"
                      sx={{ bgcolor: getStatusColor(project.status), color: '#fff' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600} color="primary.main">
                      {formatCurrency(project.total_earned || 0, project.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(project.start_date)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, project)}>
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
          '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', rowGap: 1, py: 1 },
          '& .MuiTablePagination-spacer': { display: { xs: 'none', sm: 'block' } },
        }}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
      </Menu>
    </Paper>
  )
}