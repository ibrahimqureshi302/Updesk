import React, { useState } from "react"

import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  TrendingUp,
  CheckCircleRounded,
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'

/* Inline brand mark — the UpDesk "U / up-arrow" in white for the gradient panel */
function BrandMark() {
  return (
    <svg width="168" height="50" viewBox="0 0 148 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="7" height="26" rx="3.5" fill="#fff" />
      <path d="M4.5 28 Q4.5 40 16 40 Q27.5 40 27.5 28" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <rect x="24" y="14" width="7" height="16" rx="3.5" fill="#fff" />
      <path d="M21 14 L27.5 2 L34 14Z" fill="#C4B5FD" />
      <text x="44" y="30" fontFamily="Inter,system-ui,sans-serif" fontSize="24" fontWeight="800" fill="#fff">Up</text>
      <text x="76" y="30" fontFamily="Inter,system-ui,sans-serif" fontSize="24" fontWeight="800" fill="#C4B5FD">Desk</text>
    </svg>
  )
}

const FEATURES = [
  'All your Upwork data in one private dashboard',
  'Clients, contracts, proposals & profile at a glance',
  'WhatsApp alerts the moment something changes',
]

export default function Login() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password')
      return
    }
    setLoading(true)
    const success = await login(formData.username, formData.password)
    if (!success) setError('Invalid username or password')
    setLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: '#0A0F1E' }}>
      {/* ── Left brand panel (hidden on small screens) ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          p: 7,
          color: '#fff',
          background: 'linear-gradient(150deg, #0A0F1E 0%, #1E1B4B 45%, #3B2C8F 100%)',
        }}
      >
        {/* decorative glows */}
        <Box sx={{ position: 'absolute', top: -120, right: -80, width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.55) 0%, rgba(124,58,237,0) 70%)', filter: 'blur(8px)' }} />
        <Box sx={{ position: 'absolute', bottom: -140, left: -100, width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,107,228,0.5) 0%, rgba(59,107,228,0) 70%)', filter: 'blur(8px)' }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <BrandMark />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
          <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15, mb: 2 }}>
            Run your freelance<br />business from one place.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', mb: 4 }}>
            UpDesk pulls your Upwork profile, clients, earnings and proposals into a single, beautiful dashboard.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {FEATURES.map((f) => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <CheckCircleRounded sx={{ fontSize: 22, color: '#A78BFA' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.95rem' }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp sx={{ fontSize: 18, color: 'rgba(255,255,255,0.45)' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Work • Manage • Grow
          </Typography>
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 520px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
          background: 'linear-gradient(135deg, #F8F9FF 0%, #F3F0FF 100%)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            animation: 'fadeSlideIn 0.5s ease both',
          }}
        >
          {/* compact logo for mobile (brand panel hidden) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #3B6BE4 0%, #7C3AED 100%)' }}>
              <BrandMark />
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your UpDesk dashboard to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: 'text.secondary', mb: 0.75 }}>
              Username
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: 'text.secondary', mb: 0.75 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5 }}
            >
              {loading
                ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                : 'Sign in'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700 }}>
                Create one
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  )
}
