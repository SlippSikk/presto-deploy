// src/components/elements/TextBlock.jsx

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
