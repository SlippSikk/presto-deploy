import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const TextBlock = ({ content, fontSize, color }) => {
  return (
    <Typography
      variant="body1"
      style={{
        fontSize: `${fontSize}em`,
        color: color,
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        // Ensure the text does not expand the container
        display: 'block',
      }}
    >
      {content}
    </Typography>
  );
};

TextBlock.propTypes = {
  content: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default TextBlock;
