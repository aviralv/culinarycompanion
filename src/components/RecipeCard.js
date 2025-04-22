import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Favorite, 
  FavoriteBorder,
  LocalFireDepartment,
  RestaurantMenu,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

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

const RecipeInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginTop: theme.spacing(2)
}));

const SpiceLevelChip = styled(Chip)(({ level, theme }) => ({
  backgroundColor: level === 'Hot' ? '#ff4d4d' : 
                  level === 'Medium' ? '#ffa726' : 
                  '#4caf50',
  color: '#ffffff',
  '& .MuiChip-icon': {
    color: '#ffffff'
  }
}));

const ExpandMore = styled(IconButton)(({ theme, expanded }) => ({
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const RecipeCard = ({ 
  recipe, 
  onFavoriteToggle, 
  onClick,
  expanded = false,
  onExpandClick 
}) => {
  const { 
    name,
    description,
    spiceLevel,
    indianInfluence,
    nutritionNotes,
    servingSuggestions = [],
    isFavorite = false
  } = recipe;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(recipe);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    onExpandClick(recipe);
  };

  return (
    <StyledCard onClick={() => onClick(recipe)}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {name}
          </Typography>
          <IconButton
            onClick={handleFavoriteClick}
            aria-label="add to favorites"
            size="small"
          >
            {isFavorite ? (
              <Favorite color="primary" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>

        <RecipeInfo>
          <Tooltip title="Spice Level">
            <SpiceLevelChip
              icon={<LocalFireDepartment />}
              label={spiceLevel}
              level={spiceLevel}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Indian Influence">
            <Chip
              icon={<RestaurantMenu />}
              label="Indian Fusion"
              size="small"
              variant="outlined"
            />
          </Tooltip>
        </RecipeInfo>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {nutritionNotes}
          </Typography>
          <ExpandMore
            expanded={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Serving Suggestions:
            </Typography>
            <TagsContainer>
              {servingSuggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
            </TagsContainer>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {indianInfluence}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default RecipeCard; 