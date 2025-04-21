import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input page initially', () => {
    render(<App />);
    expect(screen.getByText('Culinary Companion')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., chicken, rice, onions, garlic')).toBeInTheDocument();
  });

  it('shows loading state when generating recipes', async () => {
    axios.post.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<App />);
    
    const input = screen.getByPlaceholderText('e.g., chicken, rice, onions, garlic');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    const button = screen.getByText('Create Recipes');
    fireEvent.click(button);
    
    expect(screen.getByText('Creating your recipes...')).toBeInTheDocument();
  });

  it('shows error message on API failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);
    
    const input = screen.getByPlaceholderText('e.g., chicken, rice, onions, garlic');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    const button = screen.getByText('Create Recipes');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to generate recipes. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows recipes when API call succeeds', async () => {
    const mockResponse = {
      data: {
        recipe_output: JSON.stringify({
          greeting: "Here are your recipes!",
          recipes: [
            {
              name: "Chicken Rice",
              description: "A delicious dish",
              additional_ingredients: ["salt"],
              instructions: ["Cook rice"]
            }
          ],
          sign_off: "Enjoy!"
        })
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<App />);
    
    const input = screen.getByPlaceholderText('e.g., chicken, rice, onions, garlic');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    const button = screen.getByText('Create Recipes');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Chicken Rice')).toBeInTheDocument();
      expect(screen.getByText('A delicious dish')).toBeInTheDocument();
      expect(screen.getByText('Enjoy!')).toBeInTheDocument();
    });
  });

  it('returns to input page when clicking back button', async () => {
    const mockResponse = {
      data: {
        recipe_output: JSON.stringify({
          greeting: "Here are your recipes!",
          recipes: [{ name: "Test Recipe", description: "Test", additional_ingredients: [], instructions: [] }],
          sign_off: "Enjoy!"
        })
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<App />);
    
    // Generate recipe
    const input = screen.getByPlaceholderText('e.g., chicken, rice, onions, garlic');
    fireEvent.change(input, { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText('Create Recipes'));
    
    // Wait for results and click back
    await waitFor(() => {
      fireEvent.click(screen.getByText('New Recipe'));
    });
    
    // Check if we're back to input page
    expect(screen.getByText('Culinary Companion')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., chicken, rice, onions, garlic')).toBeInTheDocument();
  });
}); 