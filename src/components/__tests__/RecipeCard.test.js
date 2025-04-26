import React from 'react';
jest.mock('swiper/react');
jest.mock('swiper/modules');
import { render, fireEvent } from '@testing-library/react';
import RecipeCard from '../RecipeCard';

const mockRecipe = {
  id: 1,
  name: 'Test Recipe',
  description: 'A delicious test.',
  spiceLevel: 'Medium',
  indianInfluence: 'Some fusion',
  nutritionNotes: 'Healthy',
  servingSuggestions: ['Rice', 'Naan'],
  isFavorite: false,
};

describe('RecipeCard', () => {
  it('renders recipe details', () => {
    const { getByText, getAllByRole } = render(<RecipeCard recipe={mockRecipe} />);
    expect(getByText('Test Recipe')).toBeInTheDocument();
    expect(getByText('A delicious test.')).toBeInTheDocument();
    expect(getByText('Medium')).toBeInTheDocument();
    expect(getByText('Healthy')).toBeInTheDocument();
    // Check serving suggestions are rendered as Chips
    const chips = getAllByRole('button', { hidden: true }); // Chips are buttons
    // Should have at least the two serving suggestions
    expect(chips.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onFavoriteToggle when favorite is clicked', () => {
    const onFavoriteToggle = jest.fn();
    const { getByLabelText } = render(
      <RecipeCard recipe={mockRecipe} onFavoriteToggle={onFavoriteToggle} />
    );
    fireEvent.click(getByLabelText(/add to favorites/i));
    expect(onFavoriteToggle).toHaveBeenCalled();
  });

  it('calls onClick when card is clicked', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onClick={onClick} />
    );
    fireEvent.click(getByText('Test Recipe'));
    expect(onClick).toHaveBeenCalled();
  });

  it('expands and collapses when expand icon is clicked', () => {
    const onExpandClick = jest.fn();
    const { getByLabelText } = render(
      <RecipeCard recipe={mockRecipe} expanded={false} onExpandClick={onExpandClick} />
    );
    fireEvent.click(getByRole('button', { name: /show more/i }));
    expect(onExpandClick).toHaveBeenCalled();
  });

  it('applies mobile styles when mobile prop is true', () => {
    const { container } = render(
      <RecipeCard recipe={mockRecipe} mobile={true} />
    );
    const card = container.querySelector('.MuiCard-root');
    expect(card).toHaveStyle('width: 100%');
  });
});
