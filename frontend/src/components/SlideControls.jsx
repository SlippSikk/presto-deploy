import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * SlideControls component that provides navigation buttons for slides.
 *
 * @param {object} props - React props.
 * @param {number} props.currentSlideIndex - Current slide index.
 * @param {number} props.totalSlides - Total number of slides.
 * @param {Function} props.onPrevious - Function to navigate to the previous slide.
 * @param {Function} props.onNext - Function to navigate to the next slide.
 * @returns {JSX.Element} Navigation buttons for slides.
 */
const SlideControls = ({ currentSlideIndex, totalSlides, onPrevious, onNext }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <IconButton
        onClick={onPrevious}
        disabled={currentSlideIndex === 0}
        aria-label="Previous Slide"
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={currentSlideIndex === totalSlides - 1}
        aria-label="Next Slide"
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
};

SlideControls.propTypes = {
  currentSlideIndex: PropTypes.number.isRequired,
  totalSlides: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default SlideControls;
