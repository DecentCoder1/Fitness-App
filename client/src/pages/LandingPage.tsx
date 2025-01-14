import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={3}
      >
        <Typography variant="h3" mb={3}>
          Welcome to Fitness App
        </Typography>
        <Typography variant="h5" mb={5}>
          Achieve your fitness goals with personalized workouts and expert guidance.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/profile"
        >
          Go to Profile
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
