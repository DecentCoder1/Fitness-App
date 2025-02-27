import React from 'react';
import { Box, Typography, Avatar, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import UpcomingSessions from '../components/UpcomingSessions'; // Import the new component
import ExerciseList from '../components/ExerciseList'; // Import the ExerciseList component

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const exercises = [
    { id: 1, name: 'Pushups', completed: true },
    { id: 2, name: 'Squats', completed: false },
    { id: 3, name: 'Plank', completed: true },
    { id: 4, name: 'Lunges', completed: false },
  ];

  const goToBookingPage = () => {
    navigate('/booking');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header Component */}
      <Header />
      <Container
        sx={{
          mt: 2,
          width: '100%',
          maxWidth: 'none',
          padding: 0,
          height: '100%',
          flexGrow: 1,
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          sx={{
            minHeight: 'calc(100vh - 64px - 16px)', // Adjust height to account for header and margin
            background: 'linear-gradient(to right, #f8fafc, #e2e8f0)',
          }}
        >
          {/* Left Bio Section */}
          <Box
            flexBasis="30%"
            bgcolor="#ffffff"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRight="1px solid #e0e0e0"
            p={4}
          >
            <Avatar
              alt={user?.fullName || 'User Avatar'}
              src="https://via.placeholder.com/150"
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: '4px solid #3b82f6',
              }}
            />
            <Typography variant="h5" fontWeight="bold" mb={1}>
              {user?.fullName || 'Guest User'}
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              {user?.isCoach ? 'Coach' : 'Fitness Enthusiast'}
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="center" px={2}>
              "Fitness is not about being better than someone else, it's about being better than you used to be."
            </Typography>
          </Box>

          {/* Right Content Section */}
          <Box flexBasis="70%" px={4} py={4}>
            {/* Top Summary Section */}
            <Box mb={3} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
              <Box
                p={2}
                flex={1}
                sx={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Summary
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  You’ve completed 15 workouts this month and logged 30 hours of exercise. Keep up the great work!
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                }}
                onClick={goToBookingPage}
              >
                Book a Slot
              </Button>
            </Box>

            {/* Upcoming Sessions Section */}
            <UpcomingSessions />

            {/* Exercises Section */}
            <ExerciseList exercises={exercises} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
