import React from 'react';
import { Card, CardContent, Box, useTheme } from '@mui/material';
import { loadingCard, loadingText } from './animations';

function LoadingCard({ lines = 3, height = '200px' }) {
  const theme = useTheme();

  return (
    <Card sx={loadingCard(theme)}>
      <CardContent>
        <Box sx={{ height }}>
          {Array.from({ length: lines }).map((_, index) => (
            <Box
              key={index}
              data-testid="loading-line"
              sx={{
                ...loadingText,
                width: index === 0 ? '80%' : index === 1 ? '60%' : '40%'
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default LoadingCard; 