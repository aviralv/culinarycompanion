import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { ThemeProvider, CssBaseline } from '@mui/material';
import InputPage from './components/InputPage';
import ResultsPage from './components/ResultsPage';
import LoadingTransition from './components/LoadingTransition';
import getTheme from './theme';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => getTheme(mode), [mode]);

  const generateRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1', {
        ingredients: ingredients,
        api_key: process.env.REACT_APP_GOOGLE_GENAI_API_KEY
      });

      if (response.data && response.data.recipe_output) {
        const recipeData = typeof response.data.recipe_output === 'string' 
          ? JSON.parse(response.data.recipe_output) 
          : response.data.recipe_output;
        setRecipes(recipeData);
      } else {
        setError('Unexpected response format from the server.');
      }
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecipes(null);
    setIngredients('');
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <LoadingTransition />
      ) : recipes ? (
        <ResultsPage 
          recipes={recipes} 
          onBack={handleReset}
          onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
          mode={mode}
        />
      ) : (
        <InputPage
          ingredients={ingredients}
          setIngredients={setIngredients}
          onSubmit={generateRecipes}
          disabled={loading}
          error={error}
          onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
          mode={mode}
        />
      )}
    </ThemeProvider>
  );
}

export default App; 