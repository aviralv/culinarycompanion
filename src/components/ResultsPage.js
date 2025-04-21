import React from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ResultsPage({ recipes, onBack }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        gap: 2
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
          sx={{ color: '#10B981', borderColor: '#10B981' }}
        >
          New Recipe
        </Button>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <RestaurantIcon sx={{ fontSize: 40, color: '#10B981' }} />
        </Box>
      </Box>

      {recipes && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center' }}>
            {recipes.greeting}
          </Typography>

          <Grid container spacing={4}>
            {recipes.recipes.map((recipe, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {recipe.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {recipe.description}
                    </Typography>

                    {recipe.additional_ingredients.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Additional Ingredients Needed:
                        </Typography>
                        <List dense>
                          {recipe.additional_ingredients.map((ingredient, i) => (
                            <ListItem key={i}>
                              <ListItemText primary={ingredient} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}

                    <Typography variant="h6" gutterBottom>
                      Instructions:
                    </Typography>
                    <List>
                      {recipe.instructions.map((instruction, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={`${i + 1}. ${instruction}`} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle1" sx={{ 
            mt: 4, 
            textAlign: 'center',
            fontStyle: 'italic' 
          }}>
            {recipes.sign_off}
          </Typography>
        </>
      )}
    </Container>
  );
}

export default ResultsPage; 