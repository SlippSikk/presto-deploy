import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
    } catch (errMsg) {
      setError(errMsg);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        backgroundColor: 'common.white', // Set form background to white
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom color="text.primary">
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={form.email}
          onChange={handleChange}
          aria-label="Email"
          InputLabelProps={{
            color: 'text.primary',
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'text.primary',
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: 'grey.400',
            },
            '& .MuiInput-underline:hover:before': {
              borderBottomColor: 'primary.main',
            },
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={form.password}
          onChange={handleChange}
          aria-label="Password"
          InputLabelProps={{
            color: 'text.primary',
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'text.primary',
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: 'grey.400',
            },
            '& .MuiInput-underline:hover:before': {
              borderBottomColor: 'primary.main',
            },
          }}
        />
        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth aria-label="Login">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
