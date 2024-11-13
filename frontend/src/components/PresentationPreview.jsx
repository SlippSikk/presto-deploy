import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';

const PresentationPreview = () => {
  const { id } = useParams();
  const { store, loading, error } = useContext(StoreContext);

  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (store?.presentations) {
      const foundPresentation = store.presentations.find((p) => p.id === id);
      setPresentation(foundPresentation || null);
    }
  }, [store, id]);

  const slides = presentation?.slides || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNextSlide();
      else if (e.key === 'ArrowLeft') goToPreviousSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden', // Prevent scrolling
        backgroundColor: '#f5f5f5',
        margin: 0,
        padding: 0,
      }}
    >
      <style>
        {`
          body {
            overflow: hidden; /* Prevent scrolling */
            margin: 0; /* Remove body margin */
          }
        `}
      </style>
      {loading ? (
        <Typography variant="h4" color="black">
          Loading presentation preview...
        </Typography>
      ) : error ? (
        <Typography variant="h4" color="error">
          Error loading presentation: {error}
        </Typography>
      ) : !presentation ? (
        <Typography variant="h4" color="black">
          Presentation not found.
        </Typography>
      ) : (
        <>
          {/* Slide Canvas */}
          <Box
            sx={{
              width: '90vw',
              height: '50vw', // Maintain 16:9 aspect ratio
              maxWidth: '1280px',
              maxHeight: '720px',
              position: 'relative',
              overflow: 'hidden',
              border: '5px solid black', // Thinner border
              backgroundColor:
                slides[currentSlideIndex]?.background?.style === 'solid'
                  ? slides[currentSlideIndex].background.color
                  : '#ffffff',
              backgroundImage:
                slides[currentSlideIndex]?.background?.style === 'gradient'
                  ? `linear-gradient(${slides[currentSlideIndex].background.gradient.direction}, ${slides[currentSlideIndex].background.gradient.colors.join(
                      ', '
                    )})`
                  : slides[currentSlideIndex]?.background?.style === 'image'
                  ? `url(${slides[currentSlideIndex].background.image})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Render Slide Elements */}
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
                    sx={{
                      fontSize: `calc(${element.fontSize}px + 1vw)`,
                      color: element.color,
                      fontFamily: slides[currentSlideIndex]?.fontFamily || 'Arial',
                      textAlign: 'center',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
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
                      objectFit: 'contain',
                    }}
                  />
                )}
                {element.type === 'video' && (
                  <video
                    src={element.src}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
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
                      border: '1px solid #ddd',
                      whiteSpace: 'pre-wrap',
                      overflow: 'auto',
                      fontSize: '14px',
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
          bottom: '15%', // Bring the arrows slightly closer to the canvas vertically
          width: '100%',
          display: 'flex',
          justifyContent: 'center', // Center the arrows relative to the canvas
          alignItems: 'center',
          padding: '0 10%', // Reduced horizontal padding for closer arrow placement
        }}
      >
        <IconButton
          onClick={goToPreviousSlide}
          disabled={currentSlideIndex === 0}
          sx={{
            color: 'black',
            '&:disabled': { opacity: 0.5 },
          }}
          aria-label="Previous Slide"
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            color: 'black',
            textAlign: 'center',
          }}
        >
          {`${currentSlideIndex + 1} / ${slides.length}`}
        </Typography>
        <IconButton
          onClick={goToNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          sx={{
            color: 'black',
            '&:disabled': { opacity: 0.5 },
          }}
          aria-label="Next Slide"
        >
          <ArrowForward />
        </IconButton>
      </Box>

        </>
      )}
    </Box>
  );
};

export default PresentationPreview;
