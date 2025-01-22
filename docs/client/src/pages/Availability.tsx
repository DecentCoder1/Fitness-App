import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const Availability: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const { user } = useUser();

  const allTimeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00 - ${hour}:59`;
  });

  const toggleTimeSlot = (slot: string) => {
    setTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSaveAvailability = async () => {
    if (!user?.isCoach) {
      alert('Only coaches can set availability.');
      return;
    }
  
    if (!selectedDate || timeSlots.length === 0) {
      alert('Please select a date and at least one time slot.');
      return;
    }
  
    try {
      const payload = {
        coachId: user._id,
        date: selectedDate.toISOString(),
        timeSlots,
      };
  
      console.log('Payload:', payload);
  
      const response = await api.post('/availability', payload);
      alert(response.data.message || 'Availability set successfully!');
    } catch (error: any) {
      console.error('Error setting availability:', error);
      alert('Failed to set availability. Please try again.');
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
          Set Your Availability
        </Typography>
        <Typography variant="body1" textAlign="center" mb={4} color="text.secondary">
          Select a date and choose your available time slots.
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
                  onChange={(date) => setSelectedDate(date as Date)}
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
              Select Time Slots
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
              {allTimeSlots.map((slot) => (
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: timeSlots.includes(slot) ? '#3b82f6' : '#ffffff',
                    color: timeSlots.includes(slot) ? '#ffffff' : '#000000',
                    fontWeight: timeSlots.includes(slot) ? 'bold' : 'normal',
                    border: timeSlots.includes(slot)
                      ? '2px solid #2563eb'
                      : '1px solid #e5e7eb',
                    transition: 'all 0.3s ease-in-out',
                    fontSize: '1.2rem',
                    borderRadius: '8px',
                    boxShadow: timeSlots.includes(slot)
                      ? '0px 4px 15px rgba(0, 0, 0, 0.2)'
                      : 'none',
                    '&:hover': {
                      backgroundColor: timeSlots.includes(slot) ? '#2563eb' : '#f3f4f6',
                    },
                  }}
                  onClick={() => toggleTimeSlot(slot)}
                  key={slot}
                >
                  {slot}
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
            onClick={handleSaveAvailability}
          >
            Save Availability
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Availability;
