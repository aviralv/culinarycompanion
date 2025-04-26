import React from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CookingPanIcon from './CookingPanIcon';
import Button from './Button';
import { staggeredListTransition } from './animations';
import { motion } from 'framer-motion';

import RecipeSwiper from './RecipeSwiper';
import RecipeCard from './RecipeCard';

function ResultsPage({ recipes, onBack, isLoading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <Container maxWidth={false} disableGutters sx={{ py: { xs: 1, sm: 4 } }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Sticky back button for mobile */}
        <Grid container alignItems="center" sx={{
          width: '100%',
          position: isMobile ? 'sticky' : 'static',
          top: 0,
          zIndex: 10,
          bgcolor: theme.palette.background.default,
          pb: 1,
          mb: { xs: 2, sm: 4 },
        }}>
          <Grid item xs={4}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              variant="outlined"
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, py: { xs: 1, sm: 2 } }}
            >
              New Recipe
            </Button>
          </Grid>
          <Grid item xs={4} display="flex" justifyContent="center">
            <CookingPanIcon
              size={isMobile ? 40 : 60}
              color={theme.palette.primary.main}
              data-testid="cooking-pan-icon"
            />
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Box>
          {recipes.greeting && (
            <Typography variant="subtitle1" sx={{
              mb: 2,
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}>
              {recipes.greeting}
            </Typography>
          )}

          <Box sx={{ mt: 4 }}>
            {isLoading ? (
              <Grid container spacing={4} justifyContent="center">
                {[...Array(2)].map((_, idx) => (
                  <Grid item xs={12} key={idx} sx={{ width: '100%' }}>
                    <Box data-testid="loading-line" sx={{ height: 180, bgcolor: 'grey.100', borderRadius: 2, mb: 2 }} />
                  </Grid>
                ))}
              </Grid>
            ) : isMobile ? (
              <RecipeSwiper recipes={recipes.recipes} />
            ) : (
              <Grid container spacing={4} justifyContent="center">
                {recipes.recipes.map((recipe, index) => (
                  <Grid item xs={12} key={recipe.id || index} sx={{ width: '100%' }}>
                    <motion.div variants={staggeredListTransition(index)}>
                      <RecipeCard recipe={recipe} fullWidth />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          {recipes.sign_off && (
            <Typography variant="subtitle1" sx={{
              mt: 3,
              textAlign: 'center',
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.95rem', sm: '1rem' },
            }}>
              {recipes.sign_off}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ResultsPage;