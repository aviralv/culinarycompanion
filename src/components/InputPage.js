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
      py: 8,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <CookingPanIcon size={80} color="#4CAF50" />
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 500,
          color: '#1A1A1A',
          fontSize: '2.5rem',
          mt: 3
        }}>
          Recipe Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ 
          mb: 4,
          fontSize: '1.125rem',
          color: '#666666'
        }}>
          Turn your ingredients into creative meals. Just type what you've got at home!
        </Typography>
      </Box>

      <Card sx={{ 
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
        borderRadius: '16px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        bgcolor: '#fff'
      }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            alignItems: 'center'
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SearchIcon sx={{ color: '#666666' }} />
                      <Typography sx={{ 
                        color: '#1f2937',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}>
                        Ingredients:
                      </Typography>
                    </Box>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4CAF50'
                  }
                },
                '& .MuiInputBase-input': {
                  pl: 1
                }
              }}
            />
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={disabled || !ingredients.trim()}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': {
                  bgcolor: '#43A047'
                },
                borderRadius: '8px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                minWidth: '140px',
                boxShadow: 'none',
                '&:disabled': {
                  bgcolor: '#E0E0E0',
                  color: '#9E9E9E'
                }
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