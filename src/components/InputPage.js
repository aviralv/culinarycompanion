import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CookingPanIcon from './CookingPanIcon';

function InputPage({ ingredients, setIngredients, onSubmit, disabled }) {
  return (
    <Container maxWidth="md" sx={{ 
      py: 4,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CookingPanIcon size={80} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Recipe Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, fontSize: '1.2rem' }}>
          Turn your ingredients into creative meals. Just type what you've got at home!
        </Typography>
      </Box>

      <Card sx={{ 
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        bgcolor: '#fff'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#1f2937',
            mb: 3
          }}>
            <SearchIcon /> Ingredients:
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            alignItems: 'flex-start'
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f9fafb'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={disabled || !ingredients.trim()}
              sx={{
                bgcolor: '#3b82f6',
                '&:hover': {
                  bgcolor: '#2563eb'
                },
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              Create Recipes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default InputPage; 