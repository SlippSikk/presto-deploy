// src/components/SlideThumbnail.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * SlideThumbnail renders a miniature preview of a slide.
 *
 * @param {object} props - React props.
 * @param {object} props.slide - The slide object to preview.
 * @returns {JSX.Element} Miniature slide preview.
 */
const SlideThumbnail = ({ slide }) => {
  // Determine background styles
  const backgroundStyles = () => {
    switch (slide.background?.style) {
      case 'solid':
        return {
          backgroundColor: slide.background.color || '#ffffff',
        };
      case 'gradient':
        return {
          backgroundImage: `linear-gradient(${slide.background.gradient.direction || 'to right'}, ${slide.background.gradient.colors.join(
            ', '
          )})`,
        };
      case 'image':
        return {
          backgroundImage: `url(${slide.background.image || ''})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return {
          backgroundColor: '#ffffff',
        };
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        ...backgroundStyles(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
      }}
    >
      {/* Display the first text element as a snippet */}
      {slide.elements
        .filter((el) => el.type === 'text')
        .slice(0, 1)
        .map((el) => (
          <Typography
            key={el.id}
            variant="caption"
            sx={{
              color: el.color || '#000000',
              fontFamily: slide.fontFamily || 'Arial',
              padding: 1,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 1,
              maxWidth: '90%',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {el.content.length > 20 ? `${el.content.slice(0, 20)}...` : el.content}
          </Typography>
        ))}
      {/* If no text elements, display slide number */}
      {slide.elements.filter((el) => el.type === 'text').length === 0 && (
        <Typography
          variant="h6"
          sx={{
            color: '#000000',
            fontFamily: slide.fontFamily || 'Arial',
          }}
        >
          Slide
        </Typography>
      )}
    </Box>
  );
};

SlideThumbnail.propTypes = {
  slide: PropTypes.object.isRequired,
};

export default SlideThumbnail;
