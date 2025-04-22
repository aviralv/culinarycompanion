import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import getTheme from '../../theme';
import Button from '../Button';

describe('Button', () => {
  const mockOnClick = jest.fn();

  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={getTheme('light')}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('renders outlined variant correctly', () => {
    renderWithTheme(<Button variant="outlined">Outlined</Button>);
    
    const button = screen.getByText('Outlined');
    expect(button).toHaveClass('MuiButton-outlined');
  });

  it('handles click events', () => {
    renderWithTheme(<Button onClick={mockOnClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('applies correct size styles', () => {
    renderWithTheme(<Button size="large">Large Button</Button>);
    
    const button = screen.getByText('Large Button');
    expect(button).toHaveStyle({ fontSize: '1.125rem' });
  });

  it('disables button when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithTheme(<Button sx={customStyle}>Styled</Button>);
    
    const button = screen.getByText('Styled');
    expect(button).toHaveStyle(customStyle);
  });

  it('renders with startIcon', () => {
    renderWithTheme(
      <Button startIcon={<span>🔍</span>}>Search</Button>
    );
    
    const button = screen.getByText('Search');
    expect(button).toHaveTextContent('🔍Search');
  });

  it('renders with endIcon', () => {
    renderWithTheme(
      <Button endIcon={<span>→</span>}>Next</Button>
    );
    
    const button = screen.getByText('Next');
    expect(button).toHaveTextContent('Next→');
  });
}); 