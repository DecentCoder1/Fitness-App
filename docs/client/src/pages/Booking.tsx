import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useUser } from '../context/UserContext'; // Import useUser hook

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Bookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { user } = useUser(); // Get user data from context

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00 - ${hour}:59`;
  });

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    console.log(selectedDate);
    console.log(selectedTime);
    console.log(user?.email);

    if (selectedDate && selectedTime && user?.email) {
      const bookingData = {
        email: user.email, // Use email from context
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
        console.error('Error confirming booking:', error);
        alert('Failed to confirm booking. Please try again.');
      }
    } else {
      alert('Please select a date, a time slot, and ensure you are logged in.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={{
        background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)',
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Book Your Time Slot
      </Typography>
      <Typography variant="body1" mb={4}>
        Select a date and an available time slot for your booking.
      </Typography>

      {/* Display Email */}
      <Typography variant="body2" mb={2} sx={{ fontStyle: 'italic' }}>
        Booking as: <strong>{user?.email || 'Guest'}</strong>
      </Typography>

      {/* Calendar */}
      <Box mb={4} sx={{ paddingLeft: '40%', paddingRight: '20%', width: '100%', maxWidth: '600px' }}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </Box>

      {/* Time Slots */}
      {selectedDate && (
        <>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Select a Time Slot
          </Typography>
          <Grid container spacing={2} mb={4}>
            {timeSlots.map((time) => (
              <Grid item xs={6} sm={4} md={3} key={time}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor:
                      selectedTime === time ? '#3b82f6' : '#ffffff',
                    color: selectedTime === time ? '#ffffff' : '#000000',
                    fontWeight: selectedTime === time ? 'bold' : 'normal',
                    '&:hover': {
                      backgroundColor:
                        selectedTime === time ? '#2563eb' : '#f3f4f6',
                    },
                  }}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" color="primary" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </>
      )}
    </Box>
  );
};

export default Bookings;
