import React, { useState, useEffect } from "react"

import { useQuery } from '@tanstack/react-query'
import { Box, Typography } from '@mui/material'
import { proposalsAPI } from '../api/proposals'
import ProposalList from '../components/Proposals/ProposalList'
import ProposalStats from '../components/Proposals/ProposalStats'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Proposals() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['proposals', page, pageSize, search, status],
    queryFn: () => proposalsAPI.getProposals({
      page,
      page_size: pageSize,
      search: search || undefined,
      status: status || undefined,
    }),
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['proposals-stats'],
    queryFn: () => proposalsAPI.getStats(),
  })

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setPage(1)
      refetch()
    }, 500)
    setSearchTimeout(timeout)
    return () => clearTimeout(timeout)
  }, [search])

  if (isLoading && !data) {
    return <LoadingSpinner />
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Proposals
      </Typography>
      
      {stats?.data && !statsLoading && (
        <Box sx={{ mb: 3 }}>
          <ProposalStats stats={stats.data} />
        </Box>
      )}
      
      <ProposalList
        proposals={data?.data?.results || []}
        loading={isLoading}
        onPageChange={(newPage, newPageSize) => {
          setPage(newPage)
          if (newPageSize) setPageSize(newPageSize)
        }}
        onSearch={setSearch}
        onStatusFilter={setStatus}
        totalCount={data?.data?.count || 0}
        page={page}
        pageSize={pageSize}
      />
    </Box>
  )
}