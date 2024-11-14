import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const LandingPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: 'center',
        mt: 8,
        backgroundColor: 'background.default',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h3" gutterBottom color="text.primary">
        Welcome to Presto
      </Typography>
      <Typography variant="h6" gutterBottom color="text.secondary">
        Your lightweight alternative to slides.com
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
          sx={{ mr: 2 }}
          aria-label="Login"
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/register"
          aria-label="Register"
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
