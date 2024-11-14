import { grey, blue, pink } from '@mui/material/colors';

/**
 * Function to generate design tokens based on the theme mode.
 *
 * @param {string} mode - The current theme mode ('light' or 'dark').
 * @returns {object} - The design tokens for the theme.
 */
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Palette values for light mode
        primary: {
          main: blue[700],
        },
        secondary: {
          main: pink[500],
        },
        background: {
          default: grey[100],
          paper: '#fff',
        },
        text: {
          primary: grey[900],
          secondary: grey[800],
        },
      }
      : {
        // Palette values for dark mode
        primary: {
          main: blue[200],
        },
        secondary: {
          main: pink[200],
        },
        background: {
          default: '#121212',
          paper: grey[900],
        },
        text: {
          primary: '#fff',
          secondary: grey[500],
        },
      }),
  },
  typography: {
    // Define global typography settings if needed
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    // Customize component styles based on the theme
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    // Add more component customizations as needed
  },
});
