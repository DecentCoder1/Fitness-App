import React from 'react';
import { Box, TextField, Button, Typography, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const Signup: React.FC = () => {
  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Signup form submitted');
  };

  const switchToSignin = () => {
    console.log('Switch to Sign In');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#25B396',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <Typography variant="h3" sx={{ color: '#FFFFFF', mb: 4 }}>
        Fitness Trainer
      </Typography>
      <Box
        sx={{
          width: '35%',
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          p: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: '#25B396', textAlign: 'center', mb: 3 }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            fullWidth
            required
            id="email"
            name="email"
            label="Email"
            placeholder="Enter email..."
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            required
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="Enter full name..."
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            required
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password..."
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <RadioGroup
            row
            aria-labelledby="userOrCoach"
            name="userOrCoach"
            sx={{ mb: 3 }}
          >
            <FormControlLabel
              value="coach"
              control={<Radio />}
              label="I am a Coach"
              sx={{ ml: 2 }}
            />
          </RadioGroup>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#FFD300',
              color: '#FFFFFF',
              fontWeight: 'bold',
              mb: 2,
              '&:hover': { bgcolor: '#FFC107' },
            }}
          >
            SIGN UP
          </Button>
        </form>
        <Button
          fullWidth
          variant="outlined"
          onClick={switchToSignin}
          sx={{
            color: '#25B396',
            fontWeight: 'bold',
          }}
        >
          ALREADY HAVE AN ACCOUNT?
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
