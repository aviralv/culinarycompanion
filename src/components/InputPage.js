import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Box,
  Card,
  CardContent,
  InputAdornment,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CookingPanIcon from './CookingPanIcon';
import Button from './Button';
import { cardStyles, fadeInUp } from './animations';
import { motion } from 'framer-motion';

function InputPage({ ingredients, setIngredients, onSubmit, disabled }) {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ 
      py: 8,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box sx={{ 
            display: 'inline-block',
            mb: 3,
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))'
          }}>
            <CookingPanIcon 
              size={120} 
              color={theme.palette.primary.main}
            />
          </Box>
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
            Find the perfect recipe using ingredients you have on hand.
            <br />
            Pantry puzzles solved: Turn what you have into what you want
          </Typography>
        </Box>

        <Card sx={cardStyles(theme)}>
          <CardContent sx={{ 
            p: { xs: 3, md: 4 },
            '&:last-child': {
              pb: { xs: 3, md: 4 }  // Override MUI's default last-child padding
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center',
              maxWidth: '800px',
              margin: '0 auto',
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
                onClick={onSubmit}
                disabled={disabled || !ingredients.trim()}
                size="large"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Discover Meals
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}

export default InputPage; 