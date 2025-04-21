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
  spacing: factor => `${0.25 * factor}rem`,
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '3rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.2
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.2
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      fontWeight: 400
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '0.75rem 1.5rem',
          borderRadius: 8,
          '&:hover': {
            boxShadow: 'none'
          }
        },
        contained: {
          boxShadow: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0px 4px 20px rgba(0, 0, 0, 0.05)'
            : '0px 4px 20px rgba(0, 0, 0, 0.2)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: mode === 'light' ? '#F7F9FC' : '#2D3748',
            '& fieldset': {
              borderColor: 'transparent'
            },
            '&:hover fieldset': {
              borderColor: 'transparent'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B6B'
            }
          }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '0.5rem 0'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: mode === 'light' ? '#F7F9FC' : '#2D3748'
          }
        }
      }
    }
  }
});

export default getTheme; 