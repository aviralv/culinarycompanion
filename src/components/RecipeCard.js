import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip,
  Collapse,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Favorite, 
  FavoriteBorder,
  LocalFireDepartment,
  RestaurantMenu,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { cardStyles, hoverScale } from './animations';

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
  backgroundColor: level === 'Hot' ? theme.palette.error.main : 
                  level === 'Medium' ? theme.palette.warning.main : 
                  theme.palette.success.main,
  color: theme.palette.common.white,
  '& .MuiChip-icon': {
    color: theme.palette.common.white
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
  onExpandClick,
  mobile = false,
}) => {
  const theme = useTheme();
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
    <Card 
      onClick={() => onClick(recipe)}
      sx={{
        ...cardStyles(theme),
        width: mobile ? '100%' : undefined,
        minHeight: mobile ? 340 : undefined,
        boxShadow: mobile ? theme.shadows[3] : theme.shadows[1],
        borderRadius: mobile ? 3 : 2,
        p: mobile ? 2 : 0,
        mb: mobile ? 2 : 0,
        transition: 'box-shadow 0.2s',
        touchAction: mobile ? 'pan-y' : undefined,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ 
            color: theme.palette.text.primary,
            fontWeight: 500
          }}>
            {name}
          </Typography>
          <IconButton
            onClick={handleFavoriteClick}
            aria-label="add to favorites"
            size="small"
            sx={hoverScale}
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
            <Typography variant="subtitle2" gutterBottom sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>
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
    </Card>
  );
};

RecipeCard.defaultProps = {
  mobile: false,
};

export default RecipeCard;