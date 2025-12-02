import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#8b5cf6',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#10b981',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function App() {
  const [selectedView, setSelectedView] = useState('dashboard');

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default' }}>
            <Dashboard />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
