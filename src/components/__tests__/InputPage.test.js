import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import getTheme from '../../theme';
import InputPage from '../InputPage';

describe('InputPage', () => {
  const mockProps = {
    ingredients: '',
    setIngredients: jest.fn(),
    onSubmit: jest.fn(),
    disabled: false,
    error: null,
    onToggleTheme: jest.fn(),
    mode: 'light'
  };

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

  it('renders correctly', () => {
    renderWithTheme(<InputPage {...mockProps} />);
    
    expect(screen.getByText('Culinary Companion')).toBeInTheDocument();
    expect(screen.getByText(/Find the perfect recipe using ingredients you have on hand\./)).toBeInTheDocument();
    expect(screen.getByText((content, node) => content.includes('Pantry puzzles solved: Turn what you have into what you want'))).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. chicken, rice, onions')).toBeInTheDocument();
    expect(screen.getByText('Discover Meals')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderWithTheme(<InputPage {...mockProps} />);
    
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    expect(mockProps.setIngredients).toHaveBeenCalledWith('chicken');
  });

  it('handles form submission', () => {
    renderWithTheme(<InputPage {...mockProps} ingredients="chicken" />);
    
    const button = screen.getByText('Discover Meals');
    fireEvent.click(button);
    
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('disables button when no ingredients', () => {
    renderWithTheme(<InputPage {...mockProps} />);
    
    const button = screen.getByText('Discover Meals');
    expect(button).toBeDisabled();
  });

  it('enables button when ingredients present', () => {
    renderWithTheme(<InputPage {...mockProps} ingredients="chicken" />);
    
    const button = screen.getByText('Discover Meals');
    expect(button).not.toBeDisabled();
  });

  it('handles Enter key press', () => {
    renderWithTheme(<InputPage {...mockProps} ingredients="chicken" />);
    
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('does not submit on Enter when ingredients empty', () => {
    renderWithTheme(<InputPage {...mockProps} />);
    
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });
}); 