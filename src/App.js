import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import axios from 'axios';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <RestaurantIcon sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Culinary Companion
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Turn your ingredients into creative meals. Just type what you've got at home!
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="e.g., chicken, rice, onions, garlic"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={generateRecipes}
          disabled={loading}
          sx={{
            bgcolor: '#10B981',
            '&:hover': {
              bgcolor: '#059669'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : '🍽️ Create Recipes'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {recipes && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {recipes.greeting}
          </Typography>

          {recipes.recipes.map((recipe, index) => (
            <Card key={index} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {recipe.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {recipe.description}
                </Typography>

                {recipe.additional_ingredients.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Additional Ingredients Needed:
                    </Typography>
                    <List dense>
                      {recipe.additional_ingredients.map((ingredient, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={ingredient} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <Typography variant="h6" gutterBottom>
                  Instructions:
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={instruction} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}

          <Typography variant="subtitle1" sx={{ mt: 2, fontStyle: 'italic' }}>
            {recipes.sign_off}
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default App; 