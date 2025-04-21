import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import SearchBar from './SearchBar';
import FilterDrawer from './FilterDrawer';

const SearchAndFilter = ({ onSearch, onFiltersChange }) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dietary: {},
    difficulty: {},
    cookingTime: 30
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearch({ term, filters });
  };

  const handleFilterChange = (category, id, value) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [id]: value
      }
    };
    setFilters(newFilters);
    updateActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCookingTimeChange = (_, newValue) => {
    const newFilters = {
      ...filters,
      cookingTime: newValue
    };
    setFilters(newFilters);
    updateActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const updateActiveFilters = useCallback((currentFilters) => {
    const active = [];

    // Add dietary filters
    Object.entries(currentFilters.dietary).forEach(([key, value]) => {
      if (value) {
        active.push({
          id: `dietary-${key}`,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          category: 'dietary'
        });
      }
    });

    // Add difficulty filters
    Object.entries(currentFilters.difficulty).forEach(([key, value]) => {
      if (value) {
        active.push({
          id: `difficulty-${key}`,
          label: `${key.charAt(0).toUpperCase() + key.slice(1)} Difficulty`,
          category: 'difficulty'
        });
      }
    });

    // Add cooking time filter if not default
    if (currentFilters.cookingTime !== 30) {
      active.push({
        id: 'cooking-time',
        label: `${currentFilters.cookingTime}min or less`,
        category: 'cookingTime'
      });
    }

    setActiveFilters(active);
  }, []);

  const handleFilterToggle = (filterId) => {
    const [category, id] = filterId.split('-');
    if (category === 'cooking-time') {
      handleCookingTimeChange(null, 30); // Reset to default
    } else {
      handleFilterChange(category, id, false);
    }
  };

  const handleClearAll = () => {
    const resetFilters = {
      dietary: {},
      difficulty: {},
      cookingTime: 30
    };
    setFilters(resetFilters);
    setActiveFilters([]);
    onFiltersChange(resetFilters);
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <SearchBar
        onSearch={handleSearch}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
        onFilterClear={handleClearAll}
        onFilterButtonClick={() => setIsFilterDrawerOpen(true)}
      />
      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        cookingTime={filters.cookingTime}
        onCookingTimeChange={handleCookingTimeChange}
      />
    </Box>
  );
};

export default SearchAndFilter; 