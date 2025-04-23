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
    <Container maxWidth="md" sx={{ 
      py: { xs: 4, sm: 6, md: 8 },
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
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 500,
            color: theme.palette.text.primary,
            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
            mt: { xs: 2, sm: 3 }
          }}>
            Culinary Companion
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1rem', sm: '1.125rem' },
            color: theme.palette.text.secondary,
            px: { xs: 2, sm: 4 },
            lineHeight: 1.6
          }}>
            Find the perfect recipe using ingredients you have on hand.
            <br />
            Pantry puzzles solved: Turn what you have into what you want
          </Typography>
        </Box>

        <Card sx={cardStyles(theme)}>
          <CardContent sx={{ 
            padding: { xs: '20px', sm: '24px', md: '32px' }
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: { xs: 2, sm: 3 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 2 },
                alignItems: { xs: 'stretch', sm: 'center' },
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
                  error={!!error}
                  helperText={error}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && ingredients.trim()) {
                      onSubmit();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ 
                        mr: 1,
                        display: { xs: 'none', sm: 'flex' }
                      }}>
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
                      pl: { xs: 2, sm: 1 },
                      py: { xs: 1.5, sm: 2 },
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
                  sx={{ 
                    whiteSpace: 'nowrap',
                    py: { xs: 1.5, sm: 2 },
                    width: { xs: '100%', sm: 'auto' }
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