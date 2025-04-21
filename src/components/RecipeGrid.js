import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import RecipeCard from './RecipeCard';

const GridContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const NoRecipes = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const RecipeGrid = ({ recipes = [], onRecipeClick, onFavoriteToggle }) => {
  if (!recipes.length) {
    return (
      <NoRecipes>
        <Typography variant="h6">
          No recipes found
        </Typography>
        <Typography variant="body1">
          Try adjusting your search or filters
        </Typography>
      </NoRecipes>
    );
  }

  return (
    <GridContainer>
      <Grid container spacing={3}>
        {recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id || index}>
            <RecipeCard
              recipe={recipe}
              onClick={onRecipeClick}
              onFavoriteToggle={onFavoriteToggle}
            />
          </Grid>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default RecipeGrid; 