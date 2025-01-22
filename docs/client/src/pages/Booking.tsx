import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, CircularProgress, Snackbar, Alert } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import api from '../services/api';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Coach {
  _id: string;
  fullName: string;
  email: string;
}

const Bookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const { user } = useUser();

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00 - ${hour}:59`;
  });

  const getCurrentTaiwanTime = () => {
    const now = new Date();
    const taiwanOffset = 8 * 60; // Taiwan is UTC+8
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + taiwanOffset * 60000);
  };

  const isTimeSlotDisabled = (time: string): boolean => {
    const currentTaiwanTime = getCurrentTaiwanTime();
    const today = new Date(currentTaiwanTime.toDateString());
    const selected = new Date((selectedDate as Date).toDateString());

    if (selected < today) {
      return true;
    }

    if (selected.getTime() === today.getTime()) {
      const [hour] = time.split(':');
      const slotTime = new Date(selected);
      slotTime.setHours(Number(hour), 0, 0, 0);

      return slotTime < currentTaiwanTime;
    }

    return false;
  };

  const handleTimeSelect = (time: string) => {
    if (!isTimeSlotDisabled(time)) {
      setSelectedTime(time);
    }
  };

  useEffect(() => {
    const fetchAvailableCoaches = async () => {
      if (!selectedTime || !selectedDate) return;

      setLoadingCoaches(true);
      try {
        const response = await api.get('/availability', {
          params: {
            date: (selectedDate as Date).toISOString(),
            timeSlot: selectedTime,
          },
        });

        setAvailableCoaches(response.data); // Response contains coach details
      } catch (error) {
        console.error('Error fetching available coaches:', error);
        setAvailableCoaches([]);
      } finally {
        setLoadingCoaches(false);
      }
    };

    fetchAvailableCoaches();
  }, [selectedDate, selectedTime]);

  const handleConfirmBooking = async () => {
    if (selectedDate && selectedTime && user?.email && selectedCoach?._id) {
      const bookingData = {
        userId: user._id,  // Ensure userId is used here, not email
        date: selectedDate instanceof Date ? selectedDate.toISOString() : null,
        timeSlot: selectedTime,
        coachId: selectedCoach._id,  // Send the selected coachId
      };

      try {
        const response = await api.post('/booking', bookingData);
        setSnackbarMessage(response.data.message || 'Booking confirmed!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (error: any) {
        console.error('Error confirming booking:', error);
        const errorMessage =
          error.response?.data?.error || 'Failed to confirm booking. Please try again.';
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage('Please select a date, a time slot, a coach, and ensure you are logged in.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #1e293b, #3b82f6)',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 4,
          boxShadow: 4,
          padding: 4,
        }}
      >
        {/* Header Component */}
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, background: 'rgba(0, 0, 0, 0.6)' }}>
          <Header />
        </Box>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} color="primary">
          Book Your Time Slot
        </Typography>

        <Grid container spacing={4}>
          {/* Calendar Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
              Select a Date
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Box sx={{ width: '100%', maxWidth: 350, padding: 2, borderRadius: 4 }}>
                <Calendar onChange={setSelectedDate} value={selectedDate} className="custom-calendar" />
              </Box>
            </Box>
          </Grid>

          {/* Time Slots Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
              Select a Time Slot
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns
                gap: 2, // Spacing between items
                padding: 2,
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                backgroundColor: '#f9fafb',
                maxHeight: 500,
                overflowY: 'auto',
              }}
            >
              {timeSlots.map((time) => (
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    textAlign: 'center',
                    cursor: isTimeSlotDisabled(time) ? 'not-allowed' : 'pointer',
                    backgroundColor: isTimeSlotDisabled(time)
                      ? '#d1d5db'
                      : selectedTime === time
                      ? '#3b82f6'
                      : '#ffffff',
                    color: isTimeSlotDisabled(time)
                      ? '#6b7280'
                      : selectedTime === time
                      ? '#ffffff'
                      : '#000000',
                    fontWeight: selectedTime === time ? 'bold' : 'normal',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: selectedTime === time ? '#2563eb' : '#f3f4f6',
                    },
                  }}
                  onClick={() => handleTimeSelect(time)}
                  key={time}
                >
                  {time}
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Available Coaches Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
              Select a Coach
            </Typography>
            {loadingCoaches ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : availableCoaches.length > 0 ? (
              <Box
                sx={{
                  maxHeight: 500,
                  overflowY: 'auto',
                  padding: 2,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  backgroundColor: '#f9fafb',
                }}
              >
                {availableCoaches.map((coach) => (
                  <Paper
                    elevation={3}
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      mb: 1,
                      backgroundColor: selectedCoach?._id === coach._id ? '#e5e7eb' : '#ffffff',  // Highlight selected coach
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: selectedCoach?._id === coach._id ? '#d1d5db' : '#e5e7eb',
                      },
                    }}
                    key={coach._id}
                    onClick={() => setSelectedCoach(coach)}  // Ensure this sets the selected coach
                  >
                    <Typography variant="h6">{coach.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {coach.email}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography textAlign="center" color="text.secondary">
                No coaches available for the selected time slot.
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Confirm Button */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              fontWeight: 'bold',
              paddingX: 4,
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' },
            }}
            onClick={handleConfirmBooking}
            disabled={!selectedCoach}  // Disable if no coach is selected
          >
            Confirm Booking
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: 'top', // Positions the snackbar at the top of the screen
          horizontal: 'right', // Aligns the snackbar to the right of the screen
        }}
        sx={{
          zIndex: 9999,  // Ensures it's on top of other elements
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings;
