// src/components/elements/ImageBlock.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const ImageBlock = ({ src, alt }) => {
  return (
    <Box>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain', // Adjust based on desired behavior
        }}
        draggable={false} // Prevent default drag behavior
      />
    </Box>
  );
};

ImageBlock.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

ImageBlock.defaultProps = {
  alt: 'Image',
};

export default ImageBlock;
