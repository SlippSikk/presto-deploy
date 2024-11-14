import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const TextBlock = ({ content, fontSize, color, fontFamily }) => {
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
        display: 'block',
        fontFamily: fontFamily, // Apply font family
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
  fontFamily: PropTypes.string.isRequired,
};

TextBlock.defaultProps = {
  fontFamily: 'Arial', // Default font
};

export default TextBlock;
