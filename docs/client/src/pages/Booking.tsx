import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useUser } from '../context/UserContext';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Bookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { user } = useUser();

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00 - ${hour}:59`;
  });

  // Function to get the current time in Taiwan (UTC+8)
  const getCurrentTaiwanTime = () => {
    const now = new Date();
    const taiwanOffset = 8 * 60; // Taiwan is UTC+8
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + taiwanOffset * 60000);
  };

  // Function to check if a time slot is disabled
  const isTimeSlotDisabled = (time: string): boolean => {
    const currentTaiwanTime = getCurrentTaiwanTime();
    const today = new Date(currentTaiwanTime.toDateString());
    const selected = new Date((selectedDate as Date).toDateString());

    // If the selected date is in the past
    if (selected < today) {
      return true;
    }

    // If the selected date is today, disable past times
    if (selected.getTime() === today.getTime()) {
      const [hour] = time.split(':');
      const slotTime = new Date(selected);
      slotTime.setHours(Number(hour), 0, 0, 0);

      return slotTime < currentTaiwanTime;
    }

    // Future dates are not disabled
    return false;
  };

  const handleTimeSelect = (time: string) => {
    if (!isTimeSlotDisabled(time)) {
      setSelectedTime(time);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedDate && selectedTime && user?.email) {
      const bookingData = {
        email: user.email,
        date: selectedDate instanceof Date ? selectedDate.toISOString() : null,
        timeSlot: selectedTime,
      };

      try {
        const response = await fetch('http://localhost:5000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        alert(data.message || 'Booking confirmed!');
      } catch (error) {
        alert('Failed to confirm booking. Please try again.');
      }
    } else {
      alert('Please select a date, a time slot, and ensure you are logged in.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #1e293b, #3b82f6)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 4,
          boxShadow: 4,
          padding: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="primary">
          Book Your Time Slot
        </Typography>
        <Typography variant="body1" textAlign="center" mb={4} color="text.secondary">
          Select a date and an available time slot for your booking.
        </Typography>

        <Typography
          variant="body2"
          mb={2}
          textAlign="center"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
        >
          Booking as: <strong>{user?.email || 'Guest'}</strong>
        </Typography>

        <Grid container spacing={4}>
          {/* Calendar Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  padding: 3,
                  borderRadius: 4,
                  transform: 'scale(1.1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto',
                }}
              >
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  className="custom-calendar"
                />
              </Box>
              <Typography
                variant="body2"
                mt={2}
                color="text.secondary"
                textAlign="center"
                sx={{ fontStyle: 'italic' }}
              >
                Use the calendar to select your desired date.
              </Typography>
            </Box>
          </Grid>

          {/* Time Slots Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
              Select a Time Slot
            </Typography>
            <Box
              sx={{
                maxHeight: 500,
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                padding: 2,
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
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
                    border: selectedTime === time
                      ? '2px solid #2563eb'
                      : '1px solid #e5e7eb',
                    transition: 'all 0.3s ease-in-out',
                    fontSize: '1.2rem',
                    borderRadius: '8px',
                    boxShadow: selectedTime === time
                      ? '0px 4px 15px rgba(0, 0, 0, 0.2)'
                      : 'none',
                    '&:hover': {
                      backgroundColor:
                        selectedTime === time ? '#2563eb' : isTimeSlotDisabled(time) ? '#d1d5db' : '#f3f4f6',
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
        </Grid>

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
          >
            Confirm Booking
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Bookings;
