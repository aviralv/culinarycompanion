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
import LoadingCard from './LoadingCard';
import RecipeSwiper from './RecipeSwiper';
import RecipeCard from './RecipeCard';

function ResultsPage({ recipes, onBack, isLoading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedRecipeId, setExpandedRecipeId] = React.useState(null);

  const handleExpandClick = (recipe) => {
    setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id);
  };

  return (
    <Container maxWidth={isMobile ? 'sm' : 'lg'} sx={{ py: { xs: 1, sm: 4 } }}>
      {/* Sticky back button for mobile */}
      <Box sx={{
        position: isMobile ? 'sticky' : 'static',
        top: 0,
        zIndex: 10,
        bgcolor: theme.palette.background.default,
        pb: 1,
        mb: { xs: 2, sm: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 0 },
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
          sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, py: { xs: 1, sm: 2 } }}
        >
          New Recipe
        </Button>
        <CookingPanIcon
          size={isMobile ? 40 : 60}
          color={theme.palette.primary.main}
          data-testid="cooking-pan-icon"
        />
        <Box sx={{ width: 40 }} /> {/* Spacer */}
      </Box>

      {isLoading ? (
        <Grid container spacing={4}>
          {[1, 2].map((index) => (
            <Grid item xs={12} md={6} key={index}>
              <LoadingCard />
            </Grid>
          ))}
        </Grid>
      ) : recipes && (
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

          {isMobile ? (
            <RecipeSwiper
              recipes={recipes.recipes}
              onRecipeClick={() => {}}
              onFavoriteToggle={() => {}}
              expandedRecipeId={expandedRecipeId}
              onExpandClick={handleExpandClick}
            />
          ) : (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={4} justifyContent="center" alignItems="flex-start" sx={{ maxWidth: 1200, mx: 'auto' }}>
                {recipes.recipes.map((recipe, index) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id || index}>
                  <motion.div variants={staggeredListTransition(index)}>
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                </Grid>
                ))}
              </Grid>
            </Box>
          )}
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
      )}
    </Container>
  );
}

export default ResultsPage;