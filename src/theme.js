import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#FF4848',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#4ECDC4',
      light: '#71D7D0',
      dark: '#3DBEB6',
      contrastText: '#FFFFFF'
    },
    background: {
      default: mode === 'light' ? '#F7F9FC' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E'
    },
    text: {
      primary: mode === 'light' ? '#2D3748' : '#FFFFFF',
      secondary: mode === 'light' ? '#718096' : '#A0AEC0'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600
    },
    h2: {
      fontWeight: 600
    },
    h3: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
});

export default getTheme; 