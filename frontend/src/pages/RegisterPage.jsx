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

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(form.email, form.password, form.name);
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
        Register
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          name="name"
          type="text"
          fullWidth
          required
          margin="normal"
          value={form.name}
          onChange={handleChange}
          aria-label="Name"
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
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          required
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
          aria-label="Confirm Password"
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
          <Button type="submit" variant="contained" color="primary" fullWidth aria-label="Register">
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
