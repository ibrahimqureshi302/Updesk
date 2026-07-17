
[200~#!/bin/bash
#!/bin/bash
~

#!/bin/bash
cd ~/Downloads/updesk/updesk_frontend

echo "Fixing all React imports..."

cat > src/main.jsx << 'MAINEOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { theme } from './theme'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: '#14a800',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
MAINEOF

cat > src/App.jsx << 'APPEOF'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Common/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Earnings from './pages/Earnings'
import Messages from './pages/Messages'
import Proposals from './pages/Proposals'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<Clients />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<Projects />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<Messages />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
APPEOF
cat > src/context/AuthContext.jsx << 'AUTHCTXEOF'
import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../api/auth'
import { setAccessToken, setRefreshToken, getAccessToken, getUser, setUser, logout as logoutUtil } from '../utils/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upworkConnected, setUpworkConnected] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken()
      const storedUser = getUser()
      
      if (token && storedUser) {
        setUserState(storedUser)
        try {
          const response = await authAPI.getUpworkStatus()
          setUpworkConnected(response.data.connected)
        } catch (error) {
          console.error('Failed to get Upwork status:', error)
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password })
      const { access, refresh } = response.data
      
      setAccessToken(access)
      setRefreshToken(refresh)
      setUserState({ username })
      setUser({ username })
      
      toast.success('Login successful!')
      navigate('/dashboard')
      return true
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed'
      toast.error(message)
      return false
    }
  }

  const register = async (username, password) => {
    try {
      await authAPI.register({ username, password })
      toast.success('Registration successful! Please login.')
      navigate('/login')
      return true
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed'
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    logoutUtil()
    setUserState(null)
    setUpworkConnected(false)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const connectUpwork = async () => {
    try {
      const response = await authAPI.getUpworkLoginUrl()
      window.location.href = response.data.auth_url
    } catch (error) {
      toast.error('Failed to get Upwork authorization URL')
      return false
    }
  }

  const checkUpworkStatus = async () => {
    try {
      const response = await authAPI.getUpworkStatus()
      setUpworkConnected(response.data.connected)
      return response.data
    } catch (error) {
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        upworkConnected,
        login,
        register,
        logout,
        connectUpwork,
        checkUpworkStatus,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
AUTHCTXEOF

# Fix useAuth hook
cat > src/hooks/useAuth.js << 'USEAUTHEOF'
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
USEAUTHEOF

cat > src/components/Common/ProtectedRoute.jsx << 'PROTECTEDEOF'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
cat > src/components/Common/LoadingSpinner.jsx << 'LOADINGEOF'
import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      gap={2}
    >
      <CircularProgress size={48} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}
LOADINGEOF
for file in src/pages/*.jsx; do
  if ! grep -q "^import React" "$file"; then
    sed -i '1iimport React from "react"\n' "$file"
    echo "Fixed: $file"
  fi
done
for file in src/components/*/*.jsx; do
  if ! grep -q "^import React" "$file"; then
    sed -i '1iimport React from "react"\n' "$file"
    echo "Fixed: $file"
  fi
done

rm -rf node_modules/.vite

echo "All fixes applied! Run 'npm run dev' to start the server."
