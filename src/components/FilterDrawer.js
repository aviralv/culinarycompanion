import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Button,
  Slider,
  FormGroup,
  FormControlLabel,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const FilterDrawer = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  cookingTime,
  onCookingTimeChange,
}) => {
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'glutenFree', label: 'Gluten Free' },
    { id: 'dairyFree', label: 'Dairy Free' },
  ];

  const difficultyLevels = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ];

  const cookingTimeMarks = [
    { value: 15, label: '15m' },
    { value: 30, label: '30m' },
    { value: 45, label: '45m' },
    { value: 60, label: '1h' },
    { value: 90, label: '1.5h' },
    { value: 120, label: '2h+' },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 360 } },
      }}
    >
      <DrawerHeader>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </DrawerHeader>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <FilterSection>
          <Typography variant="subtitle1" gutterBottom>
            Dietary Preferences
          </Typography>
          <FormGroup>
            {dietaryOptions.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={filters.dietary?.[option.id] || false}
                    onChange={(e) =>
                      onFilterChange('dietary', option.id, e.target.checked)
                    }
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </FilterSection>

        <FilterSection>
          <Typography variant="subtitle1" gutterBottom>
            Difficulty Level
          </Typography>
          <List disablePadding>
            {difficultyLevels.map((level) => (
              <ListItem
                key={level.id}
                dense
                button
                onClick={() =>
                  onFilterChange('difficulty', level.id, !filters.difficulty?.[level.id])
                }
              >
                <Checkbox
                  edge="start"
                  checked={filters.difficulty?.[level.id] || false}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={level.label} />
              </ListItem>
            ))}
          </List>
        </FilterSection>

        <FilterSection>
          <Typography variant="subtitle1" gutterBottom>
            Cooking Time
          </Typography>
          <Box sx={{ px: 2, mt: 4 }}>
            <Slider
              value={cookingTime}
              onChange={onCookingTimeChange}
              valueLabelDisplay="auto"
              marks={cookingTimeMarks}
              min={15}
              max={120}
              valueLabelFormat={(value) => `${value}m`}
            />
          </Box>
        </FilterSection>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          sx={{ mb: 1 }}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer; 