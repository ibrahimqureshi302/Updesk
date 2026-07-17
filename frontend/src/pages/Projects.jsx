import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography } from '@mui/material'
import { projectsAPI } from '../api/projects'
import ProjectList from '../components/Projects/ProjectList'
import ProjectDetail from '../components/Projects/ProjectDetail'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Projects() {
  const { id }                          = useParams()
  const [page, setPage]                 = useState(1)
  const [pageSize, setPageSize]         = useState(10)
  const [committedSearch, setCommitted] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, pageSize, committedSearch],
    queryFn:  () => projectsAPI.getProjects({
      page,
      page_size: pageSize,
      search: committedSearch || undefined,
    }),
  })

  const { data: projectDetail } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => projectsAPI.getProject(id),
    enabled:  !!id,
  })

  const handleSearch = (value) => {
    setCommitted(value)
    setPage(1)
  }

  if (isLoading && !data) return <LoadingSpinner />

  if (id && projectDetail) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          Project Details
        </Typography>
        <ProjectDetail project={projectDetail.data} />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Projects & Contracts
      </Typography>
      <ProjectList
        projects={data?.data?.results || []}
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