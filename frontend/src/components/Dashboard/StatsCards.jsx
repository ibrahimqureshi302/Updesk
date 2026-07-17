import React from "react"

import Grid from '@mui/material/Grid'
import StatCard from '../Common/StatCard'
import {
  Work as WorkIcon,
  Description as ProposalIcon,
  Chat as ChatIcon,
} from '@mui/icons-material'

export default function StatsCards({ activeContracts, openProposals, unreadMessages }) {
  const stats = [
    {
      title: 'Active Contracts',
      value: activeContracts,
      icon: WorkIcon,
      color: 'primary',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Open Proposals',
      value: openProposals,
      icon: ProposalIcon,
      color: 'info',
      trend: 'down',
      trendValue: '-5%',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: ChatIcon,
      color: 'warning',
      trend: 'up',
      trendValue: '+3',
    },
  ]

  return (
    <Grid container spacing={1.5}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  )
}