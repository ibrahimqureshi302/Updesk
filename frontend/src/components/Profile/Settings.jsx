import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  TextField,
  CircularProgress,
  Divider,
  InputAdornment,
  Chip,
} from '@mui/material'
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  QrCode as QrCodeIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import {
  useWhatsAppSettings,
  useUpdateWhatsAppSettings,
  useWhatsAppStatus,
  useSendTestWhatsApp,
} from '../../hooks/useNotifications'
import toast from 'react-hot-toast'

function ConnectionStatus({ status }) {
  if (!status) return null

  if (status.state === 'not_configured') {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Evolution API is not configured. Set <code>EVOLUTION_API_URL</code> and{' '}
        <code>EVOLUTION_API_KEY</code> in your <code>.env</code> file.
      </Alert>
    )
  }

  if (status.state === 'server_unreachable') {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {status.error}
      </Alert>
    )
  }

  if (status.connected) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CheckCircleIcon sx={{ color: '#25D366' }} />
        <Typography color="#25D366" fontWeight={600}>
          WhatsApp connected
        </Typography>
        <Chip label="LIVE" size="small" sx={{ bgcolor: '#25D366', color: '#fff', fontWeight: 700 }} />
      </Box>
    )
  }

  if (status.state === 'waiting_scan') {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="info" icon={<QrCodeIcon />} sx={{ mb: 2 }}>
          Scan this QR code with WhatsApp to connect. Open WhatsApp on your phone → Linked Devices → Link a Device.
          The page refreshes automatically once you scan.
        </Alert>
        {status.qr_base64 ? (
          <Box
            component="img"
            src={status.qr_base64}
            alt="WhatsApp QR Code"
            sx={{
              display: 'block',
              width: { xs: '100%', sm: 220 },
              maxWidth: 220,
              height: 'auto',
              aspectRatio: '1 / 1',
              border: '4px solid #25D366',
              borderRadius: 2,
              p: 1,
              bgcolor: '#fff',
            }}
          />
        ) : (
          <CircularProgress size={24} />
        )}
      </Box>
    )
  }

  if (status.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {status.error}
      </Alert>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <ErrorIcon color="warning" />
      <Typography color="text.secondary">Not connected (state: {status.state})</Typography>
    </Box>
  )
}

export default function Settings() {
  const { connectUpwork, upworkConnected } = useAuth()

  const { data: waData, isLoading: waLoading } = useWhatsAppSettings()
  const updateWA = useUpdateWhatsAppSettings()

  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useWhatsAppStatus()
  const sendTest = useSendTestWhatsApp()

  const [waForm, setWaForm] = React.useState({
    phone_number:     '',
    enabled:          false,
    notify_messages:  true,
    notify_proposals: true,
    notify_clients:   true,
  })

  React.useEffect(() => {
    if (waData) setWaForm(waData)
  }, [waData])

  const handleWaChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setWaForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleWaSave = () => {
    const phone = waForm.phone_number.trim()
    if (phone && !/^\+[1-9]\d{6,14}$/.test(phone)) {
      toast.error('Phone number must be in E.164 format, e.g. +14155238886')
      return
    }
    updateWA.mutate(waForm)
  }

  const handleSendTest = () => {
    sendTest.mutate({ phone_number: waForm.phone_number || undefined })
  }

  const isConnected = statusData?.connected === true

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Upwork Connection */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Upwork Connection
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connect your Upwork account to sync your clients, projects, earnings, and messages.
            </Typography>
            {upworkConnected ? (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Your Upwork account is connected and syncing data.
                </Alert>
                <Button variant="outlined" color="error" onClick={() => toast.error('Disconnect feature coming soon')}>
                  Disconnect Upwork
                </Button>
              </Box>
            ) : (
              <Button variant="contained" onClick={connectUpwork}>
                Connect Upwork Account
              </Button>
            )}
          </Paper>
        </Grid>

        {/* WhatsApp Notifications */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WhatsAppIcon sx={{ color: '#25D366' }} />
              <Typography variant="h6">WhatsApp Notifications</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Receive dashboard notifications (new messages, proposal updates, new clients) directly
              on WhatsApp. Powered by your self-hosted Evolution API instance.
            </Typography>

            {/* Evolution API connection status */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Evolution API Status
                </Typography>
                <Button
                  size="small"
                  startIcon={statusLoading ? <CircularProgress size={12} /> : <RefreshIcon fontSize="small" />}
                  onClick={() => refetchStatus()}
                  disabled={statusLoading}
                  sx={{ minWidth: 0, px: 1 }}
                >
                  Refresh
                </Button>
              </Box>
              {statusLoading && !statusData ? (
                <CircularProgress size={20} />
              ) : (
                <ConnectionStatus status={statusData} />
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {waLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={waForm.enabled}
                      onChange={handleWaChange('enabled')}
                      color="success"
                    />
                  }
                  label={<Typography fontWeight={600}>{waForm.enabled ? 'Enabled' : 'Disabled'}</Typography>}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Your WhatsApp Phone Number"
                  placeholder="+14155238886"
                  value={waForm.phone_number}
                  onChange={handleWaChange('phone_number')}
                  helperText="International E.164 format — the number that will receive WhatsApp messages"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Notify me about
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={waForm.notify_messages}
                        onChange={handleWaChange('notify_messages')}
                        disabled={!waForm.enabled}
                        size="small"
                      />
                    }
                    label="New Upwork messages"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={waForm.notify_proposals}
                        onChange={handleWaChange('notify_proposals')}
                        disabled={!waForm.enabled}
                        size="small"
                      />
                    }
                    label="Proposal status changes (viewed, shortlisted, interview, won/declined)"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={waForm.notify_clients}
                        onChange={handleWaChange('notify_clients')}
                        disabled={!waForm.enabled}
                        size="small"
                      />
                    }
                    label="New clients added"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    onClick={handleWaSave}
                    disabled={updateWA.isPending}
                    startIcon={updateWA.isPending ? <CircularProgress size={16} /> : <WhatsAppIcon />}
                    sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1da851' }, width: { xs: '100%', sm: 'auto' } }}
                  >
                    {updateWA.isPending ? 'Saving…' : 'Save WhatsApp Settings'}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleSendTest}
                    disabled={sendTest.isPending || !isConnected || !waForm.phone_number}
                    startIcon={sendTest.isPending ? <CircularProgress size={16} /> : <SendIcon />}
                    title={!isConnected ? 'WhatsApp must be connected first' : !waForm.phone_number ? 'Enter a phone number first' : ''}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    {sendTest.isPending ? 'Sending…' : 'Send Test Message'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
