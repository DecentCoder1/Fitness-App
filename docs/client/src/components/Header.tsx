import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  const goToBooking = () => {
    navigate('/booking');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Fitness App
        </Typography>
        <Button color="inherit" size="large" sx={{marginLeft: 1, marginRight: 1}} onClick={goToLogin}>
          Login
        </Button>
        <Button color="inherit" size="large" sx={{marginLeft: 1, marginRight: 1}} onClick={goToSignup}>
          Signup
        </Button>
        <Button color="inherit" size="large" sx={{marginLeft: 1, marginRight: 1}} onClick={goToBooking}>
          Booking
        </Button>
        <Button color="inherit" size="large" sx={{marginLeft: 1}} onClick={goToProfile}>
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
