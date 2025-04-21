import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Card,
  CardContent,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CookingPanIcon from './CookingPanIcon';

function InputPage({ ingredients, setIngredients, onSubmit, disabled }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Container maxWidth="md" sx={{ 
      py: 8,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <CookingPanIcon 
          size={80} 
          color={theme.palette.primary.main}
        />
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 500,
          color: theme.palette.text.primary,
          fontSize: '2.5rem',
          mt: 3
        }}>
          Culinary Companion
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          mb: 4,
          fontSize: '1.125rem',
          color: theme.palette.text.secondary
        }}>
          Turn your ingredients into creative meals. Just type what you've got at home!
        </Typography>
      </Box>

      <Card sx={{ 
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
        borderRadius: '16px',
        boxShadow: theme.shadows[3],
        bgcolor: theme.palette.background.paper,
        border: isLight ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`
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
                      <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                      <Typography sx={{ 
                        color: theme.palette.text.primary,
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
                  backgroundColor: theme.palette.action.hover,
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                },
                '& .MuiInputBase-input': {
                  pl: 1,
                  '&::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 0.7
                  }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={disabled || !ingredients.trim()}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark
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
                  bgcolor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled
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