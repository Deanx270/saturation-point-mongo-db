import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1C1917',
        },
        secondary: {
            main: '#CA8A04',
        },
        background: {
            default: '#FAF9F6',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0C0A09',
            secondary: '#44403C',
        },
    },
    typography: {
        fontFamily: '"Montserrat", sans-serif',
        h1: { fontFamily: '"Lora", serif', fontWeight: 600 },
        h2: { fontFamily: '"Lora", serif', fontWeight: 600 },
        h3: { fontFamily: '"Lora", serif', fontWeight: 500 },
        h4: { fontFamily: '"Lora", serif', fontWeight: 500 },
        h5: { fontFamily: '"Lora", serif', fontWeight: 500 },
        h6: { fontFamily: '"Lora", serif', fontWeight: 500 },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0.05em',
        },
    },
    shape: {
        borderRadius: 0,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '12px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 8px 32px rgba(28, 25, 23, 0.08)',
                    },
                },
                contained: {
                    backgroundColor: '#1C1917',
                    color: '#FFFFFF',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
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
