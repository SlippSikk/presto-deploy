import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Welcome to your dashboard!</Typography>
        {/* Future implementation: List of presentations */}
        <Button variant="contained" color="primary" component={Link} to="/create-presentation" sx={{ mt: 2 }}>
          Create New Presentation
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;