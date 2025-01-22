import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToDynamicPage = () => {
    if (user?.isCoach) {
      navigate('/availability'); // Navigate to availability if the user is a coach
    } else {
      navigate('/booking'); // Navigate to booking otherwise
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Fitness App
        </Typography>
        <Button color="inherit" size="large" sx={{ marginLeft: 1, marginRight: 1 }} onClick={goToDynamicPage}>
          {user?.isCoach ? 'Set Availability' : 'Booking'}
        </Button>
        <Button color="inherit" size="large" sx={{ marginLeft: 1 }} onClick={goToProfile}>
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
