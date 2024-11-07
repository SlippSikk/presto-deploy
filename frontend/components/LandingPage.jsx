import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const LandingPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Presto
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your lightweight alternative to slides.com
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/register">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;