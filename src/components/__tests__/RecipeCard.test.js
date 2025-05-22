import React from 'react';
import { render } from '@testing-library/react';
import RecipeCard from '../RecipeCard';

const mockRecipe = {
  id: 1,
  name: 'Test Recipe',
  description: 'A delicious test.'
};

describe('RecipeCard', () => {
  it('renders recipe details', () => {
    const { getByText } = render(<RecipeCard recipe={mockRecipe} />);
    expect(getByText('Test Recipe')).toBeInTheDocument();
    expect(getByText('A delicious test.')).toBeInTheDocument();
  });

  it('applies mobile styles when mobile prop is true', () => {
    const { container } = render(
      <RecipeCard recipe={mockRecipe} mobile={true} />
    );
    const card = container.querySelector('.MuiCard-root');
    expect(card).toHaveStyle('width: 100%');
  });
});
