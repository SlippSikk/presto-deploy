// src/components/PresentationPreview.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';

const PresentationPreview = () => {
  const { id } = useParams(); // Get the presentation ID from the URL
  const { store, loading, error } = useContext(StoreContext); // Access the presentations from the store
  const [presentation, setPresentation] = useState(null); // Store the current presentation
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Track the current slide

  useEffect(() => {
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

  useEffect(() => {
    // Optional: Handle keyboard navigation
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
        backgroundColor:
          slides[currentSlideIndex]?.background?.style === 'solid'
            ? slides[currentSlideIndex].background.color
            : '#ffffff', // Default to white if not solid
        backgroundImage:
          slides[currentSlideIndex]?.background?.style === 'gradient'
            ? `linear-gradient(${slides[currentSlideIndex].background.gradient.direction}, ${slides[currentSlideIndex].background.gradient.colors.join(
                ', '
              )})`
            : slides[currentSlideIndex]?.background?.style === 'image'
            ? `url(${slides[currentSlideIndex].background.image})`
            : 'none',
        backgroundSize:
          slides[currentSlideIndex]?.background?.style === 'image'
            ? 'cover'
            : 'auto',
        backgroundRepeat:
          slides[currentSlideIndex]?.background?.style === 'image'
            ? 'no-repeat'
            : 'repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
      aria-label="Presentation Preview"
    >
      {/* Slide Content */}
      <Box
        sx={{
          width: '90%',
          height: '80%',
          position: 'relative', // For absolute positioning of elements
        }}
      >
        {slides[currentSlideIndex]?.elements.map((element) => (
          <Box
            key={element.id}
            sx={{
              position: 'absolute',
              top: `${element.position.y}%`,
              left: `${element.position.x}%`,
              width: `${element.size.width}%`,
              height: `${element.size.height}%`,
              zIndex: element.layer,
            }}
          >
            {element.type === 'text' && (
              <Typography
                style={{
                  fontSize: element.fontSize,
                  color: element.color,
                  fontFamily:
                    slides[currentSlideIndex]?.fontFamily || 'Arial',
                }}
              >
                {element.content}
              </Typography>
            )}
            {element.type === 'image' && (
              <img
                src={element.src}
                alt={element.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
            {element.type === 'video' && (
              <video
                src={element.src}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                autoPlay
              />
            )}
            {element.type === 'code' && (
              <Box
                sx={{
                  fontFamily: 'monospace',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {element.code}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Navigation Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <IconButton
          onClick={goToPreviousSlide}
          disabled={currentSlideIndex === 0}
          color="secondary"
          aria-label="Previous Slide"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
          {`${currentSlideIndex + 1} / ${slides.length}`}
        </Typography>
        <IconButton
          onClick={goToNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          color="secondary"
          aria-label="Next Slide"
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

PresentationPreview.propTypes = {
  // No props needed as we're fetching data using useParams and context
};

export default PresentationPreview;
