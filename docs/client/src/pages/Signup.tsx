import React, { useState } from 'react';
import { TextField, Button, Box, Card, Typography, Checkbox, FormControlLabel, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
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
      const response = await api.post('/user/signup', formData); // Updated endpoint
      console.log('Signup successful:', response.data);
  
      // Redirect to login page
      navigate('/login');
    } catch (err: any) {
      console.error('Signup failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error during signup. Please try again.');
    }
  };  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b, #4b5563)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '90%', boxShadow: 5, borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            color="primary"
            gutterBottom
            fontWeight="bold"
            mb={2}
          >
            Sign Up
          </Typography>
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          <TextField
            color="primary"
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
            sx={{ mb: 2, marginTop: 0, marginBottom: 1.5 }}
            control={
              <Checkbox
                checked={formData.isCoach}
                onChange={(e) => setFormData({ ...formData, isCoach: e.target.checked })}
              />
            }
            label="Are you a coach?"
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignup}
            sx={{
              width: '100%',
              fontWeight: 'bold',
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' },
            }}
          >
            Signup
          </Button>
        </CardContent>
        <Typography variant="body2" textAlign="center" mb={2}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 'bold' }}>
            Login now
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default Signup;
