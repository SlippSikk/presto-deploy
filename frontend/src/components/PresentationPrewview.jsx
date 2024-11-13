// src/components/PresentationPreview.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const PresentationPreview = ({ presentation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: slides[currentSlideIndex]?.background?.color || '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Slide Content */}
      <Box
        sx={{
          width: '90%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
                  fontFamily: slides[currentSlideIndex]?.fontFamily || 'Arial',
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
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

PresentationPreview.propTypes = {
  presentation: PropTypes.shape({
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        background: PropTypes.object,
        elements: PropTypes.arrayOf(PropTypes.object),
        fontFamily: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default PresentationPreview;
