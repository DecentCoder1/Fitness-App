import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Container,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useUser } from '../context/UserContext'; // Import user context

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Get user data from context

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
          mt: 0,
          mb: 0,
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
            minHeight: 'calc(100vh - 64px)', // Adjust height considering header height
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
            py={4}
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
            <Box
              mb={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
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

              {/* Booking Button */}
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

            {/* Bottom Exercise Cards Section */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Your Exercises
            </Typography>
            <Grid container spacing={2}>
              {exercises.map((exercise) => (
                <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                  <Card
                    sx={{
                      borderRadius: '8px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <FitnessCenterIcon color="primary" />
                        <IconButton>
                          {exercise.completed ? (
                            <CheckCircleIcon sx={{ color: '#10b981' }} />
                          ) : (
                            <CheckCircleIcon sx={{ color: '#e5e7eb' }} />
                          )}
                        </IconButton>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" mt={1}>
                        {exercise.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {exercise.completed ? 'Completed' : 'Not Completed'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
