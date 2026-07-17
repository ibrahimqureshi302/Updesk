import React from "react"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          p={{ xs: 2, sm: 3 }}
        >
          <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', maxWidth: 500, width: '100%' }}>
            <Typography variant="h5" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, overflowWrap: 'break-word' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ maxWidth: 240, mx: 'auto' }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary