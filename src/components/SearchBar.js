import React, { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  padding: theme.spacing(0.5, 2),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginTop: theme.spacing(1),
  justifyContent: 'center',
}));

const SearchBar = ({ 
  onSearch, 
  activeFilters = [], 
  onFilterToggle,
  onFilterClear,
  onFilterButtonClick,
  placeholder = "Search for recipes..." 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <form onSubmit={handleSubmit}>
        <SearchContainer elevation={1}>
          <StyledInputBase
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon />
          </IconButton>
          <IconButton 
            aria-label="filters"
            onClick={onFilterButtonClick}
          >
            <FilterListIcon />
          </IconButton>
        </SearchContainer>
      </form>

      {activeFilters.length > 0 && (
        <FiltersContainer>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            {activeFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={filter.label}
                onDelete={() => onFilterToggle(filter.id)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
            {activeFilters.length > 1 && (
              <Chip
                label="Clear all"
                onClick={onFilterClear}
                color="secondary"
                size="small"
              />
            )}
          </Stack>
        </FiltersContainer>
      )}
    </Box>
  );
};

export default SearchBar; 