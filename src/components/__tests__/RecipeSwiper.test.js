import React from 'react';
jest.mock('swiper/react');
jest.mock('swiper/modules');
import { render } from '@testing-library/react';
import RecipeSwiper from '../RecipeSwiper';

const mockRecipes = [
  { id: 1, name: 'Recipe 1', description: 'Desc 1', spiceLevel: 'Hot', indianInfluence: '', nutritionNotes: '', servingSuggestions: [] },
  { id: 2, name: 'Recipe 2', description: 'Desc 2', spiceLevel: 'Mild', indianInfluence: '', nutritionNotes: '', servingSuggestions: [] },
];

describe('RecipeSwiper', () => {
  it('renders swiper slides for each recipe', () => {
    const { getByText } = render(
      <RecipeSwiper recipes={mockRecipes} />
    );
    expect(getByText('Recipe 1')).toBeInTheDocument();
    expect(getByText('Recipe 2')).toBeInTheDocument();
  });

  it('shows message when no recipes', () => {
    const { getByText } = render(
      <RecipeSwiper recipes={[]} />
    );
    expect(getByText(/no recipes found/i)).toBeInTheDocument();
  });
});
