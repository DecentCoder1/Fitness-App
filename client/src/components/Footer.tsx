import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f4f4f4',
        py: 2,
        mt: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2025 Fitness App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
