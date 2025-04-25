import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Box,
  Card,
  CardContent,
  InputAdornment,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CookingPanIcon from './CookingPanIcon';
import Button from './Button';
import { cardStyles, fadeInUp } from './animations';
import { motion } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';

function InputPage({ 
  ingredients, 
  setIngredients, 
  onSubmit, 
  disabled,
  error,
  history = [],
  onHistoryItemClick,
  mode 
}) {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{
      py: { xs: 2, sm: 4, md: 8 },
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      px: { xs: 1, sm: 3, md: 4 },
      alignItems: 'center',
    }}>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Box sx={{ 
            display: 'inline-block',
            mb: { xs: 2, sm: 3 },
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))'
          }}>
            <CookingPanIcon 
              size={90} 
              color={theme.palette.primary.main}
            />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.4rem', sm: '2rem', md: '2.5rem' },
            mt: { xs: 1, sm: 3 },
          }}>
            Culinary Companion
          </Typography>
          <Typography variant="subtitle1" sx={{
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: '0.95rem', sm: '1.125rem' },
            color: theme.palette.text.secondary,
            px: { xs: 1, sm: 4 },
            lineHeight: 1.5,
            textAlign: 'center',
          }}>
            Find the perfect recipe using ingredients you have on hand.<br />
            Pantry puzzles solved: Turn what you have into what you want
          </Typography>
        </Box>

        <Card sx={{ ...cardStyles(theme), width: '100%', maxWidth: 480, mx: 'auto', mt: { xs: 2, sm: 4 } }}>
          <CardContent sx={{
            padding: { xs: '14px', sm: '24px', md: '32px' }
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1.5, sm: 3 },
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                alignItems: 'stretch',
                width: '100%',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: 22 }} />
                  <Typography sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                  }}>
                    Ingredients
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. chicken, rice, onions"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  disabled={disabled}
                  error={!!error}
                  helperText={error}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && ingredients.trim()) {
                      onSubmit();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: theme.palette.action.hover,
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      pl: 2,
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      '&::placeholder': {
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                      },
                    },
                  }}
                />
                <Button
                  onClick={onSubmit}
                  disabled={disabled || !ingredients.trim()}
                  size="large"
                  sx={{
                    mt: 1,
                    width: '100%',
                    py: 1.4,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                  }}
                >
                  Discover Meals
                </Button>
              </Box>

              {history.length > 0 && (
                <Box sx={{ 
                  maxWidth: '800px', 
                  margin: '0 auto',
                  width: '100%'
                }}>
                  <Divider sx={{ my: { xs: 2, sm: 3 } }} />
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: { xs: 1.5, sm: 2 }
                  }}>
                    <HistoryIcon sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }} />
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      Recent Ingredients
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 0.75, sm: 1 },
                    flexWrap: 'wrap',
                    mx: { xs: -1, sm: 0 }  // Negative margin compensation on mobile
                  }}>
                    {history.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        onClick={() => onHistoryItemClick(item)}
                        sx={{
                          backgroundColor: theme.palette.action.hover,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          height: { xs: '28px', sm: '32px' },
                          '&:hover': {
                            backgroundColor: theme.palette.action.selected
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}

export default InputPage; 