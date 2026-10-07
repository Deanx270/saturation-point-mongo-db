import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1C1917', // accent-dark
    },
    secondary: {
      main: '#CA8A04', // accent-gold
    },
    background: {
      default: '#FAF9F6', // bg-primary
      paper: '#FFFFFF', // bg-card
    },
    text: {
      primary: '#0C0A09', // text-main
      secondary: '#44403C', // text-muted
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.05em',
    }
  },
  shape: {
    borderRadius: 0, // Old system looks sharp/minimalist
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(28, 25, 23, 0.08)', // shadow-hover from old system
          }
        },
        contained: {
          backgroundColor: '#1C1917',
          color: '#FFFFFF',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: 'rgba(28, 25, 23, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#1C1917',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1C1917',
            },
          },
        },
      },
    },
  },
});
