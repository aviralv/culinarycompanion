import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, useTheme } from '@mui/material';
import { cardStyles } from './animations';

const RecipeCard = ({ recipe, mobile = false }) => {
  const theme = useTheme();
  const { name, description, additional_ingredients = [], instructions = [] } = recipe;

  return (
    <Card
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
        <Typography variant="h6" component="h2" gutterBottom sx={{
          color: theme.palette.text.primary,
          fontWeight: 500
        }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        {additional_ingredients.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
              Additional Ingredients Needed:
            </Typography>
            <List dense>
              {additional_ingredients.map((ingredient, i) => (
                <ListItem key={i} sx={{ py: 0 }}>
                  <ListItemText primary={ingredient} primaryTypographyProps={{ color: 'text.secondary' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
            Instructions:
          </Typography>
          <List>
            {instructions.map((instruction, i) => (
              <ListItem key={i} sx={{ py: 0 }}>
                <ListItemText primary={`${i + 1}. ${instruction}`} primaryTypographyProps={{ color: 'text.secondary' }} />
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