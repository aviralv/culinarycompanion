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
    const lines = screen.getAllByTestId('loading-line');
    expect(lines.length).toBe(3);
  });

  it('renders with custom number of lines', () => {
    renderWithTheme(<LoadingCard lines={5} />);
    
    const loadingLines = screen.getAllByTestId('loading-line');
    expect(loadingLines).toHaveLength(5);
  });

  it('renders with custom height', () => {
    renderWithTheme(<LoadingCard height="300px" />);
    // Find the Box with the height style
    const boxes = screen.getAllByTestId('loading-line');
    const parentBox = boxes[0].parentElement;
    expect(parentBox).toHaveStyle({ height: '300px' });
  });

  it('applies width styles to loading lines', () => {
    renderWithTheme(<LoadingCard />);
    const loadingLines = screen.getAllByTestId('loading-line');
    expect(loadingLines[0]).toHaveStyle({ width: '80%' });
    expect(loadingLines[1]).toHaveStyle({ width: '60%' });
    expect(loadingLines[2]).toHaveStyle({ width: '40%' });
  });

  it('renders with different line widths', () => {
    renderWithTheme(<LoadingCard />);
    
    const loadingLines = screen.getAllByTestId('loading-line');
    expect(loadingLines[0]).toHaveStyle({ width: '80%' });
    expect(loadingLines[1]).toHaveStyle({ width: '60%' });
    expect(loadingLines[2]).toHaveStyle({ width: '40%' });
  });
}); 