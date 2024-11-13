import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';

const PresentationPreview = () => {
  const { id } = useParams(); // Hook 1
  const { store, loading, error } = useContext(StoreContext); // Hook 2
  const [presentation, setPresentation] = useState(null); // Hook 3
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Hook 4

  useEffect(() => { // Hook 5
    if (store && store.presentations) {
      const foundPresentation = store.presentations.find((p) => p.id === id);
      setPresentation(foundPresentation);
    }
  }, [store, id]);

  if (loading) {
    return <Typography>Loading presentation preview...</Typography>;
  }

  if (error) {
    return <Typography>Error loading presentation: {error}</Typography>;
  }

  if (!presentation) {
    return <Typography>Presentation not found.</Typography>;
  }

  const slides = presentation.slides;

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex < slides.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  useEffect(() => { // Hook 6
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        // ... [styles]
      }}
      aria-label="Presentation Preview"
    >
      {/* Slide Content */}
      <Box
        sx={{
          width: '90%',
          height: '80%',
          position: 'relative',
        }}
      >
        {slides[currentSlideIndex]?.elements.map((element) => (
          <Box key={element.id} sx={{ /* styles */ }}>
            {/* Render elements based on type */}
          </Box>
        ))}
      </Box>

      {/* Navigation Controls */}
      <Box sx={{ /* styles */ }}>
        <IconButton onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
          <ArrowBack />
        </IconButton>
        <Typography>{`${currentSlideIndex + 1} / ${slides.length}`}</Typography>
        <IconButton onClick={goToNextSlide} disabled={currentSlideIndex === slides.length - 1}>
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PresentationPreview;
