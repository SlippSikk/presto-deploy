import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * SlideNumber component that displays the current slide number.
 *
 * @param {object} props - React props.
 * @param {number} props.current - Current slide number.
 * @param {number} props.total - Total number of slides.
 * @returns {JSX.Element} A box displaying the slide number.
 */
const SlideNumber = ({ current, total }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '50%',
        boxShadow: 1,
      }}
      aria-label="Slide Number"
    >
      <Typography variant="caption">{`${current}/${total}`}</Typography>
    </Box>
  );
};

SlideNumber.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default SlideNumber;
