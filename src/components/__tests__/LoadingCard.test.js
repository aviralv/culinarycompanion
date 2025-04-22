import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import getTheme from '../../theme';
import LoadingCard from '../LoadingCard';

describe('LoadingCard', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={getTheme('light')}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders with default props', () => {
    renderWithTheme(<LoadingCard />);
    
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    expect(card).toHaveStyle({ height: '200px' });
    
    // Check for loading lines
    const loadingLines = screen.getAllByTestId('loading-line');
    expect(loadingLines).toHaveLength(3);
  });

  it('renders with custom number of lines', () => {
    renderWithTheme(<LoadingCard lines={5} />);
    
    const loadingLines = screen.getAllByTestId('loading-line');
    expect(loadingLines).toHaveLength(5);
  });

  it('renders with custom height', () => {
    renderWithTheme(<LoadingCard height="300px" />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveStyle({ height: '300px' });
  });

  it('applies loading animation styles', () => {
    renderWithTheme(<LoadingCard />);
    
    const loadingLines = screen.getAllByTestId('loading-line');
    loadingLines.forEach(line => {
      expect(line).toHaveStyle({
        background: expect.stringContaining('linear-gradient'),
        animation: expect.stringContaining('shimmer')
      });
    });
  });

  it('renders with different line widths', () => {
    renderWithTheme(<LoadingCard />);
    
    const loadingLines = screen.getAllByTestId('loading-line');
    expect(loadingLines[0]).toHaveStyle({ width: '80%' });
    expect(loadingLines[1]).toHaveStyle({ width: '60%' });
    expect(loadingLines[2]).toHaveStyle({ width: '40%' });
  });
}); 