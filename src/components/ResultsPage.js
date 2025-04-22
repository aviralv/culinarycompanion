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
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CookingPanIcon from './CookingPanIcon';
import Button from './Button';
import { cardStyles, staggeredListTransition } from './animations';
import { motion } from 'framer-motion';
import LoadingCard from './LoadingCard';

function ResultsPage({ recipes, onBack, isLoading }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

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
        >
          New Recipe
        </Button>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <CookingPanIcon 
            size={60} 
            color={theme.palette.primary.main}
          />
        </Box>
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
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: theme.palette.text.secondary
          }}>
            {recipes.greeting}
          </Typography>

          <Grid container spacing={4}>
            {recipes.recipes.map((recipe, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  variants={staggeredListTransition(index)}
                >
                  <Card sx={cardStyles(theme)}>
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ 
                        color: theme.palette.text.primary,
                        fontWeight: 500
                      }}>
                        {recipe.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {recipe.description}
                      </Typography>

                      {recipe.additional_ingredients.length > 0 && (
                        <>
                          <Typography variant="h6" gutterBottom sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: 500
                          }}>
                            Additional Ingredients Needed:
                          </Typography>
                          <List dense>
                            {recipe.additional_ingredients.map((ingredient, i) => (
                              <motion.div
                                key={i}
                                variants={staggeredListTransition(i)}
                              >
                                <ListItem>
                                  <ListItemText 
                                    primary={ingredient}
                                    primaryTypographyProps={{
                                      color: 'text.secondary'
                                    }}
                                  />
                                </ListItem>
                              </motion.div>
                            ))}
                          </List>
                        </>
                      )}

                      <Typography variant="h6" gutterBottom sx={{ 
                        color: theme.palette.text.primary,
                        fontWeight: 500
                      }}>
                        Instructions:
                      </Typography>
                      <List>
                        {recipe.instructions.map((instruction, i) => (
                          <motion.div
                            key={i}
                            variants={staggeredListTransition(i)}
                          >
                            <ListItem>
                              <ListItemText 
                                primary={`${i + 1}. ${instruction}`}
                                primaryTypographyProps={{
                                  color: 'text.secondary'
                                }}
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle1" sx={{ 
            mt: 4, 
            textAlign: 'center',
            fontStyle: 'italic',
            color: theme.palette.text.secondary
          }}>
            {recipes.sign_off}
          </Typography>
        </motion.div>
      )}
    </Container>
  );
}

export default ResultsPage; 