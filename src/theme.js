import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h1: {
      fontFamily: 'Comfortaa, Arial, sans-serif',
      fontSize: '3rem', // 48px
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Comfortaa, Arial, sans-serif',
      fontSize: '2.5rem', // 40px
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Comfortaa, Arial, sans-serif',
      fontSize: '2rem', // 32px
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'Comfortaa, Arial, sans-serif',
      fontSize: '1.75rem', // 28px
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'Comfortaa, Arial, sans-serif',
      fontSize: '1.5rem', // 24px
      fontWeight: 400,
    },
    h6: {
      fontFamily: 'Comfortaa, Arial, sans-serif',
      fontSize: '1.25rem', // 20px
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
    },
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#0b3954', // Navy Blue
    },
    secondary: {
      main: '#087e8b', // Teal
    },
    background: {
      default: '#f4f4f4', 
      paper: '#ffffff',
    },
    
    warning: {
      main: '#726a95', // Muted Purple
    },
    info: {
      main: '#087e8b', // Teal
    },
    text: {
      primary: '#0b3954', // Navy Blue
      secondary: '#726a95', // Muted Purple
    },
  },
});

export default theme;
