import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * SlideThumbnail renders a miniature preview of a slide with a numerical label.
 *
 * @param {object} props - React props.
 * @param {object} props.slide - The slide object to preview.
 * @param {number} props.index - The numerical label of the slide.
 * @returns {JSX.Element} Miniature slide preview.
 */
const SlideThumbnail = ({ slide, index }) => {
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
        width: '120px', // Reduced width
        height: '70px', // Reduced height for a more rectangular shape
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        ...backgroundStyles(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      {/* Numerical Label */}
      <Box
        sx={{
          position: 'absolute',
          top: 6, // Adjusted for smaller size
          left: 6, // Adjusted for smaller size
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: '#ffffff',
          borderRadius: '50%',
          width: 20, // Adjusted size
          height: 20, // Adjusted size
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10, // Adjusted font size
          fontWeight: 'bold',
        }}
      >
        {index}
      </Box>
    </Box>
  );
};

SlideThumbnail.propTypes = {
  slide: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default SlideThumbnail;
