import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import {
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  getUser,
  setUser,
  logout as logoutUtil,
} from '../utils/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState]               = React.useState(null);
  const [loading, setLoading]              = React.useState(true);
  const [upworkConnected, setUpworkConnected] = React.useState(false);

  const navigate     = useNavigate();
  const queryClient  = useQueryClient(); // ← access React Query cache

  // ── Restore session on page load ─────────────────────────────────────────
  React.useEffect(() => {
    const checkAuth = async () => {
      const token      = getAccessToken();
      const storedUser = getUser();

      if (token && storedUser) {
        setUserState(storedUser);
        try {
          const response = await authAPI.getUpworkStatus();
          setUpworkConnected(response.data.connected);
        } catch (error) {
          // silently fail — upwork status is optional
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { access, refresh } = response.data;

      setAccessToken(access);
      setRefreshToken(refresh);
      setUserState({ username });
      setUser({ username });

      // Clear any stale cache from a previous user session
      // so the new user always fetches fresh data
      queryClient.clear();

      toast.success('Login successful!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (username, password) => {
    try {
      await authAPI.register({ username, password });
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    // 1. Clear localStorage tokens and user object
    logoutUtil();

    // 2. Reset auth state
    setUserState(null);
    setUpworkConnected(false);

    // 3. ── THE CRITICAL FIX ──────────────────────────────────────────────
    // Clear the entire React Query cache so the next user
    // never sees the previous user's data, even for a split second.
    // queryClient.clear() removes ALL cached queries from memory.
    queryClient.clear();

    toast.success('Logged out successfully');
    navigate('/login');
  };

  // ── Connect Upwork ────────────────────────────────────────────────────────
  const connectUpwork = async () => {
    try {
      const response = await authAPI.getUpworkLoginUrl();
      window.location.href = response.data.auth_url;
    } catch (error) {
      toast.error('Failed to get Upwork authorization URL');
      return false;
    }
  };

  // ── Check Upwork status ───────────────────────────────────────────────────
  const checkUpworkStatus = async () => {
    try {
      const response = await authAPI.getUpworkStatus();
      setUpworkConnected(response.data.connected);
      return response.data;
    } catch (error) {
      return null;
    }
  };

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
  );
};