import React from 'react';
import { Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Exercise {
  id: number;
  name: string;
  completed: boolean;
}

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <div>
      <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FitnessCenterIcon color="primary" />
                  <IconButton>
                    {exercise.completed ? (
                      <CheckCircleIcon sx={{ color: '#10b981' }} />
                    ) : (
                      <CheckCircleIcon sx={{ color: '#e5e7eb' }} />
                    )}
                  </IconButton>
                </div>
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
    </div>
  );
};

export default ExerciseList;
