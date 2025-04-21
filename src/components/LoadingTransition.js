import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingTransition() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 3
    }}>
      <CircularProgress
        size={60}
        thickness={4}
        sx={{ color: '#10B981' }}
      />
      <Typography variant="h6" color="text.secondary">
        Creating your recipes...
      </Typography>
    </Box>
  );
}

export default LoadingTransition; 