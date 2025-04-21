import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function InputPage({ ingredients, setIngredients, onSubmit, disabled }) {
  return (
    <Container maxWidth="md" sx={{ 
      py: 4,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <RestaurantIcon sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Culinary Companion
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Turn your ingredients into creative meals. Just type what you've got at home!
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4,
        maxWidth: '600px',
        mx: 'auto',
        width: '100%'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="e.g., chicken, rice, onions, garlic"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={disabled}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && ingredients.trim()) {
              onSubmit();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={disabled || !ingredients.trim()}
          sx={{
            bgcolor: '#10B981',
            '&:hover': {
              bgcolor: '#059669'
            }
          }}
        >
          🍽️ Create
        </Button>
      </Box>
    </Container>
  );
}

export default InputPage; 