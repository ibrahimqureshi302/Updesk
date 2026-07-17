import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:         '#3B6BE4',
      light:        '#6B8EF0',
      dark:         '#2550C0',
      contrastText: '#ffffff',
    },
    secondary: {
      main:         '#7C3AED',
      light:        '#A06AF0',
      dark:         '#5B21B6',
      contrastText: '#ffffff',
    },
    background: {
      default: '#EEF2FF',
      paper:   '#ffffff',
    },
    error:   { main: '#EF4444', light: '#FCA5A5', dark: '#DC2626' },
    warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    info:    { main: '#3B82F6', light: '#93C5FD', dark: '#1D4ED8' },
    success: { main: '#10B981', light: '#6EE7B7', dark: '#059669' },
    text: {
      primary:   '#0F172A',
      secondary: '#475569',
      disabled:  '#94A3B8',
    },
    divider: '#E2E8F0',
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 15,
    h1: { fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.9rem',  fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.6rem',  fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4 },
    h6: { fontSize: '1.1rem',  fontWeight: 600, lineHeight: 1.4 },
    body1:   { fontSize: '1.05rem',  lineHeight: 1.6 },
    body2:   { fontSize: '0.9375rem', lineHeight: 1.6 },
    button:  { textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem' },
    caption: { fontSize: '0.8rem',   lineHeight: 1.5 },
  },

  shape: { borderRadius: 12 },

  shadows: [
    'none',
    '0 1px 3px rgba(59,107,228,0.08), 0 1px 2px rgba(15,23,42,0.04)',
    '0 4px 8px rgba(59,107,228,0.08), 0 2px 4px rgba(15,23,42,0.04)',
    '0 8px 16px rgba(59,107,228,0.10), 0 4px 8px rgba(15,23,42,0.05)',
    '0 16px 32px rgba(59,107,228,0.12), 0 8px 16px rgba(15,23,42,0.06)',
    '0 24px 48px rgba(59,107,228,0.14)',
    ...Array(19).fill('0 24px 48px rgba(59,107,228,0.14)'),
  ],

  components: {

    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: {
          background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
          minHeight: '100vh',
        },
        '::-webkit-scrollbar':       { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background:   'linear-gradient(180deg, #3B6BE4 0%, #7C3AED 100%)',
          borderRadius: 6,
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'linear-gradient(180deg, #2550C0 0%, #5B21B6 100%)',
        },
        '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        '@keyframes pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(16,185,129,0)' },
        },
        '@keyframes fadeSlideIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background:       'linear-gradient(135deg, #0A0F1E 0%, #111827 40%, #1E1B4B 100%)',
          borderBottom:     '1px solid rgba(255,255,255,0.05)',
          boxShadow:        '0 1px 20px rgba(0,0,0,0.35)',
          backdropFilter:   'blur(12px)',
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: 64 },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight:    600,
          borderRadius:  10,
          padding:       '7px 18px',
          letterSpacing: '0.01em',
          transition:    'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #3B6BE4 0%, #5B4FD6 100%)',
          boxShadow:  '0 2px 10px rgba(59,107,228,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2550C0 0%, #4C3FC4 100%)',
            boxShadow:  '0 4px 18px rgba(59,107,228,0.45)',
            transform:  'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', background: 'rgba(59,107,228,0.05)' },
        },
        text: {
          '&:hover': { background: 'rgba(59,107,228,0.07)' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition:   'all 0.2s ease',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius:    16,
          border:          '1px solid rgba(226,232,240,0.8)',
          backgroundImage: 'none',
        },
        elevation0: { boxShadow: 'none' },
        elevation1: { boxShadow: '0 1px 4px rgba(59,107,228,0.07), 0 1px 2px rgba(15,23,42,0.04)' },
        elevation2: { boxShadow: '0 4px 12px rgba(59,107,228,0.09), 0 2px 4px rgba(15,23,42,0.05)' },
        elevation3: { boxShadow: '0 8px 24px rgba(59,107,228,0.11), 0 4px 8px rgba(15,23,42,0.06)' },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border:       '1px solid rgba(226,232,240,0.8)',
          boxShadow:    '0 1px 4px rgba(59,107,228,0.07)',
          transition:   'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 28px rgba(59,107,228,0.14)',
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius:  10,
          transition:    'all 0.15s ease',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight:   600,
          fontSize:     '0.8rem',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background:    'rgba(15,23,42,0.92)',
          backdropFilter:'blur(8px)',
          borderRadius:  8,
          fontSize:      '0.8rem',
          padding:       '5px 10px',
          border:        '1px solid rgba(255,255,255,0.08)',
        },
        arrow: { color: 'rgba(15,23,42,0.92)' },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius:    14,
          border:          '1px solid rgba(226,232,240,0.8)',
          boxShadow:       '0 16px 40px rgba(59,107,228,0.15), 0 4px 12px rgba(15,23,42,0.08)',
          backdropFilter:  'blur(12px)',
          background:      'rgba(255,255,255,0.97)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin:       '2px 8px',
          padding:      '8px 12px',
          fontSize:     '0.9375rem',
          transition:   'all 0.12s',
          '&:hover': { background: 'rgba(59,107,228,0.08)' },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #E2E8F0', fontSize: '0.9rem' },
        head: {
          fontWeight:      700,
          backgroundColor: '#F5F7FF',
          color:           '#0F172A',
          fontSize:        '0.8rem',
          textTransform:   'uppercase',
          letterSpacing:   '0.06em',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.9375rem' },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3B6BE4' },
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(59,107,228,0.12)' },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow:    '0 32px 64px rgba(59,107,228,0.2)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E2E8F0' },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root:           { borderRadius: 4, height: 6 },
        bar:            { borderRadius: 4 },
        colorPrimary:   { backgroundColor: '#EEF2FF' },
        barColorPrimary:{ background: 'linear-gradient(90deg, #3B6BE4, #7C3AED)' },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700, fontSize: '0.65rem' },
      },
    },
  },
});
