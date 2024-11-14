import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';
import CodeBlock from './elements/CodeBlock';
import VideoBlock from './elements/VideoBlock';

const PresentationPreview = () => {
  const { id } = useParams();
  const { store, loading, error } = useContext(StoreContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(null); // Local state for the slide index
  const [slides, setSlides] = useState([]); // Local state for slides

  // Load the presentation and slides
  useEffect(() => {
    if (store?.presentations) {
      const foundPresentation = store.presentations.find((p) => p.id === id);
      setPresentation(foundPresentation || null);
      setSlides(foundPresentation?.slides || []);
    }
  }, [store, id]);

  // Set initial slide index from URL parameter
  useEffect(() => {
    if (slides.length > 0) {
      const slideParam = parseInt(searchParams.get('slide'), 10);
      if (!isNaN(slideParam) && slideParam >= 1 && slideParam <= slides.length) {
        setCurrentSlideIndex(slideParam - 1); // Convert 1-based index to 0-based
      } else if (currentSlideIndex === null) {
        setCurrentSlideIndex(0); // Default to the first slide
        setSearchParams({ slide: 1 }, { replace: true });
      }
    }
  }, [searchParams, slides, setSearchParams, currentSlideIndex]);

  // Update URL when slide index changes
  const updateUrl = (newIndex) => {
    const currentSlideNumber = newIndex + 1;
    const slideParam = parseInt(searchParams.get('slide'), 10);
    if (slideParam !== currentSlideNumber) {
      setSearchParams({ slide: currentSlideNumber }, { replace: true });
    }
  };

  // Navigate to the next slide
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      updateUrl(newIndex);
    }
  };

  // Navigate to the previous slide
  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      updateUrl(newIndex);
    }
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
        overflow: 'hidden',
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
      ) : slides.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No slides available.
        </Typography>
      ) : currentSlideIndex === null ? (
        <Typography variant="h6" color="textSecondary">
          Loading slide...
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
              border: '5px solid black',
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
                {element.type === 'video' && <VideoBlock src={element.src} autoPlay />}
                {element.type === 'code' && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      backgroundColor: '#f6f8fa',
                      padding: '10px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <CodeBlock code={element.code} language={element.language} fontSize={1.2} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Navigation Controls */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 10%',
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
                mx: 2, // Add horizontal margin
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
