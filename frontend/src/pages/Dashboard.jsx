import React from "react"

import { useQuery } from '@tanstack/react-query'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material'
import { clientsAPI } from '../api/clients'
import { projectsAPI } from '../api/projects'
import { messagesAPI } from '../api/messages'
import { proposalsAPI } from '../api/proposals'
import { useSendTestWhatsApp } from '../hooks/useNotifications'
import StatsCards from '../components/Dashboard/StatsCards'
import RecentClients from '../components/Dashboard/RecentClients'
import RecentProjects from '../components/Dashboard/RecentProjects'
import RecentMessages from '../components/Dashboard/RecentMessages'
import ProposalStats from '../components/Proposals/ProposalStats'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Dashboard() {
  const sendTest = useSendTestWhatsApp()

  const { data: clients,       isLoading: clientsLoading   } = useQuery({ queryKey: ['clients',        { page_size: 3 }], queryFn: () => clientsAPI.getClients({ page_size: 3 }) })
  const { data: projects,      isLoading: projectsLoading  } = useQuery({ queryKey: ['projects',       { page_size: 3 }], queryFn: () => projectsAPI.getProjects({ page_size: 3 }) })
  const { data: messages,      isLoading: messagesLoading  } = useQuery({ queryKey: ['messages',       { page_size: 3 }], queryFn: () => messagesAPI.getThreads({ page_size: 3 }) })
  const { data: proposalStats, isLoading: statsLoading     } = useQuery({ queryKey: ['proposals-stats'], queryFn: () => proposalsAPI.getStats() })

  if (clientsLoading || projectsLoading || messagesLoading || statsLoading) {
    return <LoadingSpinner />
  }

  const activeContracts = projects?.data?.results?.filter(p => p.status === 'active').length || 0
  const openProposals   = proposalStats?.data?.total || 0
  const unreadMessages  = messages?.data?.results?.filter(m => m.unread_count > 0).length || 0

  return (
    <Box sx={{
      height:        { xs: 'auto', md: '100%' },
      display:       'flex',
      flexDirection: 'column',
      gap:           1.5,
      overflow:      { xs: 'visible', md: 'hidden' },
    }}>

      {/* ── Page title ── */}
      <Box sx={{
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => sendTest.mutate({})}
            disabled={sendTest.isPending}
            startIcon={sendTest.isPending
              ? <CircularProgress size={14} />
              : <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
            }
            sx={{ borderColor: '#25D366', color: '#25D366', '&:hover': { borderColor: '#1da851', color: '#1da851' } }}
          >
            {sendTest.isPending ? 'Sending…' : 'Test WhatsApp'}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* ── Row 1: Stats Cards ── */}
      <Box sx={{ flexShrink: 0 }}>
        <StatsCards
          activeContracts={activeContracts}
          openProposals={openProposals}
          unreadMessages={unreadMessages}
        />
      </Box>

      {/* ── Row 2: Charts ── */}
      <Grid container spacing={1.5} sx={{ flexShrink: 0, height: { xs: 'auto', md: 260 } }}>
        <Grid item xs={12} sx={{ height: { xs: 320, sm: 280, md: '100%' } }}>
          <Box sx={{ height: '100%' }}>
            <ProposalStats stats={proposalStats?.data} />
          </Box>
        </Grid>
      </Grid>

      {/* ── Row 3: Recent Items — fills remaining height on desktop, stacks on mobile ── */}
      <Grid container spacing={1.5} sx={{ flex: { xs: 'unset', md: 1 }, minHeight: 0 }}>
        <Grid item xs={12} md={4} sx={{ height: { xs: 340, md: '100%' } }}>
          <RecentClients clients={clients?.data?.results || []} />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: { xs: 340, md: '100%' } }}>
          <RecentProjects projects={projects?.data?.results || []} />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: { xs: 340, md: '100%' } }}>
          <RecentMessages messages={messages?.data?.results || []} />
        </Grid>
      </Grid>

    </Box>
  )
}
