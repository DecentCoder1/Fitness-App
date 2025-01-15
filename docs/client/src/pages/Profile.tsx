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

const Profile: React.FC = () => {
  const navigate = useNavigate();

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
    <Container
      sx={{
        mt: 0, // Remove margin to align with viewport height
        mb: 0, // Remove bottom margin
        width: '85%', // 85% of the screen width
        maxWidth: 'none', // Disable maxWidth constraint
        height: '100%', // Full height of the viewport
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        sx={{
          minHeight: '100vh', // Ensures full viewport height
          background: 'linear-gradient(to right, #f8fafc, #e2e8f0)',
          borderRadius: '8px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
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
          p={3}
          boxShadow={3}
        >
          <Avatar
            alt="Profile Picture"
            src="https://via.placeholder.com/150"
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid #3b82f6',
              boxShadow: 3,
            }}
          />
          <Typography variant="h5" fontWeight="bold" mb={1}>
            John Doe
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Fitness Enthusiast | Coach
          </Typography>
          <Typography variant="body2" color="textSecondary">
            "Fitness is not about being better than someone else, it's about being better than you used to be."
          </Typography>
        </Box>

        {/* Right Content Section */}
        <Box flexBasis="70%" p={3}>
          {/* Top Summary Section */}
          <Box
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              p={2}
              sx={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #3b82f6',
                },
                flex: 1,
                mr: 2,
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
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
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
  );
};

export default Profile;
