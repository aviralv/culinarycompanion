import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import getTheme from '../../theme';
import LoadingTransition from '../LoadingTransition';

describe('LoadingTransition', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={getTheme('light')}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders loading message', () => {
    renderWithTheme(<LoadingTransition />);
    expect(screen.getByText('Creating your recipes...')).toBeInTheDocument();
  });

  it('renders loading spinner', () => {
    const { container } = renderWithTheme(<LoadingTransition />);
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('centers content vertically and horizontally', () => {
    const { container } = renderWithTheme(<LoadingTransition />);
    const box = container.firstChild;
    expect(box).toHaveStyle({
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    });
  });
}); 