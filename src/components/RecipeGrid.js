import React, { useState } from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import RecipeCard from './RecipeCard';

const GridContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const MessagePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.mode === 'light' ? 
    theme.palette.primary.light + '20' : // 20 is for 12% opacity
    theme.palette.primary.dark + '20',
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  }
}));

const NoRecipes = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const RecipeGrid = ({ 
  data = { greeting: '', recipes: [], signOff: '' }, 
  onRecipeClick, 
  onFavoriteToggle 
}) => {
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const handleExpandClick = (recipe) => {
    setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id);
  };

  if (!data.recipes?.length) {
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
      {data.greeting && (
        <MessagePaper elevation={0}>
          <Typography variant="h6" gutterBottom>
            {data.greeting}
          </Typography>
        </MessagePaper>
      )}

      <Grid container spacing={3}>
        {data.recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id || index}>
            <RecipeCard
              recipe={recipe}
              onClick={onRecipeClick}
              onFavoriteToggle={onFavoriteToggle}
              expanded={expandedRecipeId === recipe.id}
              onExpandClick={handleExpandClick}
            />
          </Grid>
        ))}
      </Grid>

      {data.signOff && (
        <MessagePaper elevation={0} sx={{ mt: 3 }}>
          <Typography variant="body1" align="center" sx={{ fontStyle: 'italic' }}>
            {data.signOff}
          </Typography>
        </MessagePaper>
      )}
    </GridContainer>
  );
};

export default RecipeGrid; 