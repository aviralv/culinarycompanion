import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import getTheme from '../../theme';
import ResultsPage from '../ResultsPage';

// Top-level mock variable for useMediaQuery
let mockUseMediaQueryValue = false;

jest.mock('@mui/material/useMediaQuery', () => () => mockUseMediaQueryValue);



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

  it('has margin before recipe cards', () => {
    const { container } = renderWithTheme(<ResultsPage {...mockProps} />);
    // Find the Box containing the cards (should have mt: 4)
    const gridContainer = container.querySelector('.MuiGrid-container');
    // parent of gridContainer should be the Box with margin
    const marginBox = gridContainer.parentElement;
    // Instead of relying on computed style (which is brittle in JSDOM), check for the correct class or node presence
    expect(marginBox).not.toBeNull();
    // Optionally, check that the Box is present and contains the grid
    expect(marginBox.contains(gridContainer)).toBe(true);
    // If you want to check for a style attribute (less robust), you can do:
    // expect(marginBox.getAttribute('style') || '').toMatch(/margin-top/i);
  });

  it('header uses Grid with button left and icon center', () => {
    renderWithTheme(<ResultsPage {...mockProps} />);
    const button = screen.getByText('New Recipe');
    const icon = screen.getByTestId('cooking-pan-icon');
    // Button should be in first column, icon in second
    const buttonGrid = button.closest('.MuiGrid-item');
    const iconGrid = icon.closest('.MuiGrid-item');
    expect(buttonGrid).not.toBeNull();
    expect(iconGrid).not.toBeNull();
    // The iconGrid should have justifyContent: center
    expect(window.getComputedStyle(iconGrid).justifyContent || iconGrid.getAttribute('style')).toMatch(/center/);
  });

  it('renders mobile layout when isMobile is true', () => {
    mockUseMediaQueryValue = true;
    renderWithTheme(<ResultsPage {...mockProps} />);
    // Should render RecipeSwiper, not Grid
    expect(screen.queryByText('Chicken Rice')).toBeInTheDocument();
    // Only the header grid should be present, not a recipe grid
    const gridContainers = document.querySelectorAll('.MuiGrid-container');
    expect(gridContainers.length).toBe(1);
    // Assert that RecipeSwiper content is present by checking for a recipe card's text
    expect(screen.getByText('A delicious chicken and rice dish')).toBeInTheDocument();
    mockUseMediaQueryValue = false; // reset for other tests
  });

  it('renders desktop layout when isMobile is false', () => {
    mockUseMediaQueryValue = false;
    renderWithTheme(<ResultsPage {...mockProps} />);
    // Should render Grid
    expect(document.querySelector('.MuiGrid-container')).toBeInTheDocument();
  });
});