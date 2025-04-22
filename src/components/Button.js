import React from 'react';
import { Button as MuiButton, useTheme, alpha } from '@mui/material';
import { hoverScale } from './animations';

const CustomButton = React.forwardRef(({ 
  children, 
  variant = 'contained', 
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  sx,
  ...props 
}, ref) => {
  const theme = useTheme();

  const baseStyles = {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    ...(variant === 'outlined' && {
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px',
        backgroundColor: alpha(theme.palette[color].main, 0.04)
      }
    }),
    ...(variant === 'contained' && {
      boxShadow: 'none',
      '&:hover': {
        boxShadow: theme.shadows[2]
      }
    }),
    ...hoverScale
  };

  const sizeStyles = {
    small: {
      padding: '6px 16px',
      fontSize: '0.875rem'
    },
    medium: {
      padding: '8px 22px',
      fontSize: '1rem'
    },
    large: {
      padding: '11px 24px',
      fontSize: '1.125rem'
    }
  };

  return (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        ...baseStyles,
        ...sizeStyles[size],
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton; 