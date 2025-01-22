import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useUser } from '../context/UserContext';
import api from '../services/api';

interface Coach {
  _id: string;
  fullName: string;
}

interface Session {
  _id: string;
  date: string;
  timeSlot: string;
  coachId: string;  // Store coachId here
  coach?: Coach;    // Add coach details to session
}

const UpcomingSessions: React.FC = () => {
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/booking/user', {
          params: { userId: user?._id }, // Fetching bookings using the user ID
        });
        const fetchedSessions = response.data;
        console.log(fetchedSessions);
    
        // Fetch coach details for each session using the coachId
        for (const session of fetchedSessions) {
          if (session.coach) {
            try {
              const coachResponse = await api.get(`/user/${session.coach}`);  // Updated to fetch by coachId
              console.log(coachResponse);
              session.coach = coachResponse.data;  // Add coach details to session
            } catch (error) {
              console.error('Error fetching coach details:', error);
            }
          }
        }
    
        setSessions(fetchedSessions);  // Set sessions with populated coach data
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoadingSessions(false);
      }    
    };

    if (user) fetchSessions(); // Ensure user is present before fetching sessions
  }, [user]);

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Upcoming Sessions
      </Typography>
      {loadingSessions ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : sessions.length > 0 ? (
        <Grid container spacing={2}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session._id}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  {new Date(session.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'normal' }}>
                  {session.timeSlot}
                </Typography>
                {session.coach ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Coach: {session.coach.fullName} {/* Display Coach Name */}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Coach information not available
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" textAlign="center">
          No upcoming sessions found.
        </Typography>
      )}
    </Box>
  );
};

export default UpcomingSessions;
