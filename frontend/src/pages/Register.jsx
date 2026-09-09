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
import { Visibility, VisibilityOff, CheckCircleRounded, TrendingUp } from '@mui/icons-material'
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
  'Set up your dashboard in under a minute',
  'Sync clients, contracts & proposals automatically',
  'Get WhatsApp alerts the moment something changes',
]

export default function Register() {
  const { register: registerUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })

  const validateForm = () => {
    let isValid = true
    const errors = { username: '', password: '', confirmPassword: '' }

    if (!formData.username.trim()) {
      errors.username = 'Username is required'
      isValid = false
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
      isValid = false
    }

    if (!formData.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      })
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')
    const success = await registerUser(formData.username, formData.password)
    if (!success) {
      setError('Registration failed. Username may already exist.')
    }
    setLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: '#0A140A' }}>
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
          background: 'linear-gradient(150deg, #0A140A 0%, #0F3D0F 45%, #14a800 100%)',
        }}
      >
        {/* decorative glows */}
        <Box sx={{ position: 'absolute', top: -120, right: -80, width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,168,0,0.5) 0%, rgba(20,168,0,0) 70%)', filter: 'blur(8px)' }} />
        <Box sx={{ position: 'absolute', bottom: -140, left: -100, width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,249,157,0.35) 0%, rgba(217,249,157,0) 70%)', filter: 'blur(8px)' }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <BrandMark />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
          <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15, mb: 2 }}>
            Start managing your<br />freelance business today.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', mb: 4 }}>
            Create your free UpDesk account and bring your Upwork profile, clients and proposals into one dashboard.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {FEATURES.map((f) => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <CheckCircleRounded sx={{ fontSize: 22, color: '#D9F99D' }} />
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
          background: 'linear-gradient(135deg, #F5FFF0 0%, #F0FFE8 100%)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
          }}
        >
          {/* compact logo for mobile (brand panel hidden) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #0F3D0F 0%, #14a800 100%)' }}>
              <BrandMark />
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign up to start managing your Upwork business.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{ mb: 2.5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              sx={{ mb: 3.5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 2 }}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
                Login here
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  )
}
