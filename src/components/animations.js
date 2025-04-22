import { keyframes } from '@emotion/react';

export const hoverScale = {
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer'
  }
};

export const hoverLift = {
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
  }
};

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInUp = {
  animation: `${fadeIn} 0.5s ease-out forwards`
};

export const steamAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-20px) scale(1.4);
    opacity: 0;
  }
`;

export const cardStyles = (theme) => ({
  borderRadius: '16px',
  boxShadow: theme.shadows[3],
  bgcolor: theme.palette.background.paper,
  border: theme.palette.mode === 'light' ? 'none' : `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
});

export const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const loadingStyles = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '2000px 100%',
  animation: `${shimmer} 2s infinite linear`,
  borderRadius: '4px'
};

export const loadingText = {
  ...loadingStyles,
  height: '1em',
  width: '60%',
  margin: '0.5em 0'
};

export const loadingCard = (theme) => ({
  ...cardStyles(theme),
  '& .MuiCardContent-root': {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em'
  }
});

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export const listItemTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.2 }
};

export const staggeredListTransition = (index) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: index * 0.1 }
}); 