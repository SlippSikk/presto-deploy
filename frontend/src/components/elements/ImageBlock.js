// src/components/elements/ImageBlock.jsx

import React from 'react';
import PropTypes from 'prop-types';

const ImageBlock = ({ src, alt }) => {
  return <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

ImageBlock.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageBlock;
