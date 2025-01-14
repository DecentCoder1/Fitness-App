import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    isCoach: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await api.post('/auth/signup', formData);
      console.log('Signup successful:', response.data);

      // Redirect to login page
      navigate('/');
    } catch (err) {
      setError('Error during signup. Please try again.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" mb={2}>
        Signup
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        sx={{ mb: 2, maxWidth: '400px' }}
      />
      <TextField
        label="Full Name"
        variant="outlined"
        fullWidth
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        sx={{ mb: 2, maxWidth: '400px' }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        sx={{ mb: 2, maxWidth: '400px' }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isCoach}
            onChange={(e) => setFormData({ ...formData, isCoach: e.target.checked })}
          />
        }
        label="Are you a coach?"
      />
      <Button variant="contained" color="primary" onClick={handleSignup}>
        Signup
      </Button>
    </Box>
  );
};

export default Signup;
