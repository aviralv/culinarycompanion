import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import { AccessTime, Restaurant, Favorite, FavoriteBorder } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    cursor: 'pointer'
  }
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  position: 'relative'
});

const RecipeInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2)
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginTop: theme.spacing(2)
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)'
  }
}));

const RecipeCard = ({ recipe, onFavoriteToggle, onClick }) => {
  const { 
    title, 
    image, 
    cookTime, 
    servings, 
    tags = [], 
    isFavorite = false 
  } = recipe;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(recipe);
  };

  return (
    <StyledCard onClick={() => onClick(recipe)}>
      <StyledCardMedia
        image={image || 'https://via.placeholder.com/400x200?text=No+Image'}
        title={title}
      >
        <FavoriteButton
          onClick={handleFavoriteClick}
          aria-label="add to favorites"
        >
          {isFavorite ? (
            <Favorite color="primary" />
          ) : (
            <FavoriteBorder />
          )}
        </FavoriteButton>
      </StyledCardMedia>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {title}
        </Typography>
        
        <RecipeInfo>
          {cookTime && (
            <InfoItem>
              <AccessTime fontSize="small" />
              <Typography variant="body2">{cookTime}</Typography>
            </InfoItem>
          )}
          {servings && (
            <InfoItem>
              <Restaurant fontSize="small" />
              <Typography variant="body2">{servings} servings</Typography>
            </InfoItem>
          )}
        </RecipeInfo>

        {tags.length > 0 && (
          <TagsContainer>
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                color="secondary"
                variant="outlined"
              />
            ))}
            {tags.length > 3 && (
              <Chip
                label={`+${tags.length - 3}`}
                size="small"
                variant="outlined"
              />
            )}
          </TagsContainer>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default RecipeCard; 