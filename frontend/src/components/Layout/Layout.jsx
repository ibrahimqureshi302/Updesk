import React, { useEffect, useState } from "react"
import { Outlet, useLocation } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Sidebar from './Sidebar'
import Header from './Header'

const drawerWidth = 280

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile' })(
  ({ theme, open, isMobile }) => ({
    flexGrow:        1,
    display:         'flex',
    flexDirection:   'column',
    height:          '100vh',
    overflow:        'hidden',
    padding:         theme.spacing(2),
    minWidth:        0,
    transition: theme.transitions.create('margin', {
      easing:   theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
    ...(open && !isMobile && {
      transition: theme.transitions.create('margin', {
        easing:   theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    [theme.breakpoints.down('sm')]: {
      padding:    theme.spacing(1.25),
      marginLeft: 0,
    },
  })
)

const DrawerHeader = styled('div')(({ theme }) => ({
  display:        'flex',
  alignItems:     'center',
  padding:        theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  flexShrink:     0,
}))

export default function Layout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(!isMobile)
  const { pathname } = useLocation()
  const isDashboard = pathname === '/' || pathname === '/dashboard'

  // Keep the drawer's open/closed default in sync when crossing the mobile breakpoint
  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  // Auto-close the overlay drawer on mobile after navigating to a page
  useEffect(() => {
    if (isMobile) setOpen(false)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Header open={open && !isMobile} handleDrawerToggle={() => setOpen(!open)} />
      <Sidebar open={open} drawerWidth={drawerWidth} isMobile={isMobile} onClose={() => setOpen(false)} />
      <Main open={open} isMobile={isMobile}>
        <DrawerHeader />

        {/* Scrollable content area */}
        <Box sx={{ flex: 1, overflowY: (isDashboard && !isMobile) ? 'hidden' : 'auto', overflowX: 'hidden', minHeight: 0 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  )
}
