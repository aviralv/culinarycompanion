import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, useTheme } from '@mui/material';
import { cardStyles } from './animations';

const RecipeCard = ({ recipe, mobile = false }) => {
  const theme = useTheme();
  const { name, description, additional_ingredients = [], instructions = [] } = recipe;

  return (
    <Card
      tabIndex={0}
      sx={{
        ...cardStyles(theme),
        width: mobile ? '100%' : undefined,
        minHeight: mobile ? 340 : undefined,
        boxShadow: mobile ? theme.shadows[3] : theme.shadows[1],
        borderRadius: mobile ? 3 : 2,
        p: mobile ? 2.5 : 1.5,
        mb: mobile ? 2 : 0,
        transition: 'box-shadow 0.2s, transform 0.15s',
        touchAction: mobile ? 'pan-y' : undefined,
        '&:hover': !mobile ? {
          boxShadow: theme.shadows[6],
          transform: 'translateY(-2px) scale(1.015)',
        } : undefined,
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Typography 
          variant="h5"
          component="h2"
          gutterBottom
          align="left"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            letterSpacing: 0.2,
            mb: 2
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          gutterBottom 
          align="left"
          sx={{ mb: 2 }}
        >
          {description}
        </Typography>
        {additional_ingredients.length > 0 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom align="left" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
              Additional Ingredients Needed:
            </Typography>
            <List dense>
              {additional_ingredients.map((ingredient, i) => (
                <ListItem key={i} sx={{ py: 0.75 }}>
                  <ListItemText primary={ingredient} primaryTypographyProps={{ color: 'text.secondary', variant: 'body1', align: 'left' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom align="left" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
            Instructions:
          </Typography>
          <List>
            {instructions.map((instruction, i) => (
              <ListItem key={i} sx={{ py: 0.75 }}>
                <ListItemText primary={`${i + 1}. ${instruction}`} primaryTypographyProps={{ color: 'text.secondary', variant: 'body1', align: 'left' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

RecipeCard.defaultProps = {
  mobile: false,
};

export default RecipeCard;