import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import getTheme from '../../theme';
import ResultsPage from '../ResultsPage';

describe('ResultsPage', () => {
  const mockRecipes = {
    greeting: "Here are your recipes!",
    recipes: [
      {
        name: "Chicken Rice",
        description: "A delicious chicken and rice dish",
        additional_ingredients: ["salt", "pepper"],
        instructions: ["Cook rice", "Cook chicken"]
      },
      {
        name: "Stir Fry",
        description: "Quick and easy stir fry",
        additional_ingredients: ["soy sauce"],
        instructions: ["Chop vegetables", "Cook in wok"]
      }
    ],
    sign_off: "Enjoy your meal!"
  };

  const mockProps = {
    recipes: mockRecipes,
    onBack: jest.fn(),
    isLoading: false
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

  it('renders recipes correctly', () => {
    renderWithTheme(<ResultsPage {...mockProps} />);
    
    expect(screen.getByText(mockRecipes.greeting)).toBeInTheDocument();
    expect(screen.getByText(mockRecipes.sign_off)).toBeInTheDocument();
    
    // Check first recipe
    expect(screen.getByText('Chicken Rice')).toBeInTheDocument();
    expect(screen.getByText('A delicious chicken and rice dish')).toBeInTheDocument();
    expect(screen.getByText('salt')).toBeInTheDocument();

    // Check second recipe
    expect(screen.getByText('Stir Fry')).toBeInTheDocument();
    expect(screen.getByText('Quick and easy stir fry')).toBeInTheDocument();
    expect(screen.getByText('soy sauce')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderWithTheme(<ResultsPage {...mockProps} />);
    
    const backButton = screen.getByText('New Recipe');
    fireEvent.click(backButton);
    
    expect(mockProps.onBack).toHaveBeenCalled();
  });

  it('displays numbered instructions', () => {
    renderWithTheme(<ResultsPage {...mockProps} />);
    
    expect(screen.getByText('1. Cook rice')).toBeInTheDocument();
    expect(screen.getByText('2. Cook chicken')).toBeInTheDocument();
  });

  it('displays additional ingredients section when present', () => {
    renderWithTheme(<ResultsPage {...mockProps} />);
    
    expect(screen.getAllByText('Additional Ingredients Needed:')[0]).toBeInTheDocument();
  });

  it('renders in a two-column layout on larger screens', () => {
    const { container } = renderWithTheme(<ResultsPage {...mockProps} />);
    
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    renderWithTheme(<ResultsPage {...mockProps} isLoading={true} />);
    
    const loadingCards = screen.getAllByTestId('loading-line');
    expect(loadingCards.length).toBeGreaterThan(0);
  });

  it('does not show recipes when loading', () => {
    renderWithTheme(<ResultsPage {...mockProps} isLoading={true} />);
    
    expect(screen.queryByText('Chicken Rice')).not.toBeInTheDocument();
    expect(screen.queryByText('Stir Fry')).not.toBeInTheDocument();
  });

  it('shows cooking pan icon', () => {
    renderWithTheme(<ResultsPage {...mockProps} />);
    
    const icon = screen.getByTestId('cooking-pan-icon');
    expect(icon).toBeInTheDocument();
  });
}); 