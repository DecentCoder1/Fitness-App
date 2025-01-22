import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import api from '../services/api';
import { useUser } from '../context/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser(); // Access the context
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/user/login', { email, password }); // Updated endpoint
      console.log('Login successful:', response.data);
  
      // Save user data in context
      setUser(response.data.user);
      console.log(response.data.user);
  
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Persist to localStorage
      navigate('/');
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
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
          >
            Welcome Back!
          </Typography>
          <Typography variant="body1" textAlign="center" color="textSecondary" mb={2}>
            Stay fit and achieve your goals.
          </Typography>
          {error && (
            <Typography color="error" mb={2} textAlign="center">
              {error}
            </Typography>
          )}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{
              fontWeight: 'bold',
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' },
            }}
          >
            Login
          </Button>
          <Typography variant="body2" textAlign="center" mt={2}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 'bold' }}>
              Sign Up Now
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
