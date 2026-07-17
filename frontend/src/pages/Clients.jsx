import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography } from '@mui/material'
import { clientsAPI } from '../api/clients'
import ClientList from '../components/Clients/ClientList'
import ClientDetail from '../components/Clients/ClientDetail'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Clients() {
  const { id }                              = useParams()
  const [page, setPage]                     = useState(1)
  const [pageSize, setPageSize]             = useState(10)
  const [committedSearch, setCommitted]     = useState('')

  // API call fires ONLY when committedSearch changes
  // committedSearch changes ONLY when user presses Enter or clicks a suggestion or clears the box
  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, pageSize, committedSearch],
    queryFn:  () => clientsAPI.getClients({
      page,
      page_size: pageSize,
      search: committedSearch || undefined,
    }),
  })

  const { data: clientDetail } = useQuery({
    queryKey: ['client', id],
    queryFn:  () => clientsAPI.getClient(id),
    enabled:  !!id,
  })

  // called by SearchWithSuggestions onCommit / onClear
  const handleSearch = (value) => {
    setCommitted(value)
    setPage(1)          // reset to page 1 every time search changes
  }

  if (isLoading && !data) return <LoadingSpinner />

  if (id && clientDetail) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          Client Details
        </Typography>
        <ClientDetail client={clientDetail.data} onUpdate={() => {}} />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Clients
      </Typography>
      <ClientList
        clients={data?.data?.results || []}
        loading={isLoading}
        onPageChange={(newPage, newPageSize) => {
          setPage(newPage)
          if (newPageSize) setPageSize(newPageSize)
        }}
        onSearch={handleSearch}
        totalCount={data?.data?.count || 0}
        page={page}
        pageSize={pageSize}
      />
    </Box>
  )
}