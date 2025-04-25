import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RecipeCard from './RecipeCard';

const RecipeSwiper = ({ recipes, onRecipeClick, onFavoriteToggle, expandedRecipeId, onExpandClick }) => {
  const swiperRef = useRef(null);

  if (!recipes?.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6">No recipes found</Typography>
        <Typography variant="body1">Try adjusting your search or filters</Typography>
      </Box>
    );
  }

  return (
    <Swiper
      ref={swiperRef}
      modules={[Navigation, Pagination]}
      spaceBetween={16}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      style={{ paddingBottom: 32 }}
    >
      {recipes.map((recipe, idx) => (
        <SwiperSlide key={recipe.id || idx}>
          <Box sx={{ px: { xs: 1.5, sm: 4 }, py: 2, maxWidth: 420, mx: 'auto', width: '100%' }}>
            <RecipeCard
              recipe={recipe}
              mobile
            />
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RecipeSwiper;
