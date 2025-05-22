import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    expect(screen.getByPlaceholderText('e.g. chicken, rice, onions')).toBeInTheDocument();
  });

  it('shows loading state when generating recipes', async () => {
    // Mock a pending request with a valid data property to avoid TypeError
    axios.post.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { recipe_output: '' } }), 100))
    );

    render(<App />);
    
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    const button = screen.getByText('Discover Meals');
    fireEvent.click(button);
    
    expect(screen.getByText('Creating your recipes...')).toBeInTheDocument();
  });

  it('shows error message on API failure', async () => {
    // Mock a rejected request (error state)
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);
    
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    const button = screen.getByText('Discover Meals');
    await act(async () => {
      fireEvent.click(button);
    });
        await screen.findByText('Failed to generate recipes. Please try again.');
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
            },
            {
              name: "Egg-cellent Omelette",
              description: "A witty breakfast option.",
              additional_ingredients: ["pepper"],
              instructions: ["Beat eggs", "Cook in pan"]
            }
          ],
          sign_off: "Enjoy!"
        })
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<App />);
    
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Discover Meals'));
    });
        await waitFor(() => {
      expect(screen.getByText('Chicken Rice')).toBeInTheDocument();
      expect(screen.getByText('Egg-cellent Omelette')).toBeInTheDocument();
      expect(screen.getByText('A delicious dish')).toBeInTheDocument();
      expect(screen.getByText('A witty breakfast option.')).toBeInTheDocument();
      expect(screen.getByText('Enjoy!')).toBeInTheDocument();
    });
  });

  it('shows error if backend returns malformed JSON', async () => {
    const mockResponse = {
      data: {
        recipe_output: '{ greeting: "Oops!", "recipes": [] }' // malformed JSON but recipes array present
      }
    };
    // Always return an object with a data property, even for malformed JSON
    axios.post.mockResolvedValueOnce({ data: { recipe_output: '{ greeting: "Oops!", "recipes": [] }' } });
    render(<App />);
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Discover Meals'));
    });
    await screen.findByText('Failed to generate recipes. Please try again.');
  });

  it('shows error if required fields are missing in JSON', async () => {
    // Always return an object with a data property, even for empty recipes
    axios.post.mockResolvedValueOnce({ data: { recipe_output: JSON.stringify({ greeting: '', recipes: [], sign_off: '' }) } });
    render(<App />);
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Discover Meals'));
    });
    await screen.findByText('No recipes found or invalid data returned.');
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
    const input = screen.getByPlaceholderText('e.g. chicken, rice, onions');
    fireEvent.change(input, { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText('Discover Meals'));
    
    // Wait for results and click back
    await waitFor(() => {
      fireEvent.click(screen.getByText('New Recipe'));
    });
    
    // Check if we're back to input page
    expect(screen.getByText('Culinary Companion')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. chicken, rice, onions')).toBeInTheDocument();
  });
}); 