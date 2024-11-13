// src/components/modals/BackgroundPickerModal.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { SketchPicker } from 'react-color';

/**
 * BackgroundPickerModal allows users to select and customize the slide's background.
 *
 * @param {object} props - React props.
 * @param {boolean} props.open - Whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {object} props.currentBackground - Current background settings of the slide.
 * @param {function} props.onUpdate - Function to update the background settings.
 * @returns {JSX.Element} BackgroundPickerModal component.
 */
const BackgroundPickerModal = ({ open, onClose, currentBackground, onUpdate }) => {
  // Initialize with default values if currentBackground is undefined
  const [backgroundStyle, setBackgroundStyle] = useState('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [gradientColors, setGradientColors] = useState(['#ff7e5f', '#feb47b']);
  const [imageURL, setImageURL] = useState('');

  // Effect to set initial state based on currentBackground
  useEffect(() => {
    if (currentBackground) {
      setBackgroundStyle(currentBackground.style || 'solid');
      setSolidColor(currentBackground.color || '#ffffff');
      setGradientDirection(currentBackground.gradient?.direction || 'to right');
      setGradientColors(currentBackground.gradient?.colors || ['#ff7e5f', '#feb47b']);
      setImageURL(currentBackground.image || '');
    } else {
      // Reset to defaults if currentBackground is undefined
      setBackgroundStyle('solid');
      setSolidColor('#ffffff');
      setGradientDirection('to right');
      setGradientColors(['#ff7e5f', '#feb47b']);
      setImageURL('');
    }
  }, [currentBackground, open]);

  /**
   * Handler for changing the background style.
   *
   * @param {object} e - Event object.
   */
  const handleStyleChange = (e) => {
    setBackgroundStyle(e.target.value);
  };

  /**
   * Handler for changing the solid color.
   *
   * @param {object} color - Color object from SketchPicker.
   */
  const handleSolidColorChange = (color) => {
    setSolidColor(color.hex);
  };

  /**
   * Handler for changing the gradient direction.
   *
   * @param {object} e - Event object.
   */
  const handleGradientDirectionChange = (e) => {
    setGradientDirection(e.target.value);
  };

  /**
   * Handler for changing a gradient color.
   *
   * @param {number} index - Index of the color to change.
   * @param {object} color - Color object from SketchPicker.
   */
  const handleGradientColorChange = (index, color) => {
    const newColors = [...gradientColors];
    newColors[index] = color.hex;
    setGradientColors(newColors);
  };

  /**
   * Handler to add a new gradient color.
   */
  const handleAddGradientColor = () => {
    if (gradientColors.length < 5) { // Limit to 5 colors
      setGradientColors([...gradientColors, '#000000']);
    }
  };

  /**
   * Handler to remove a gradient color.
   *
   * @param {number} index - Index of the color to remove.
   */
  const handleRemoveGradientColor = (index) => {
    const newColors = gradientColors.filter((_, i) => i !== index);
    setGradientColors(newColors);
  };

  /**
   * Handler for changing the image URL.
   *
   * @param {object} e - Event object.
   */
  const handleImageURLChange = (e) => {
    setImageURL(e.target.value);
  };

  /**
   * Handler for submitting the background changes.
   */
  const handleSubmit = () => {
    const updatedBackground = { style: backgroundStyle };

    if (backgroundStyle === 'solid') {
      updatedBackground.color = solidColor;
    } else if (backgroundStyle === 'gradient') {
      updatedBackground.gradient = {
        direction: gradientDirection,
        colors: gradientColors,
      };
    } else if (backgroundStyle === 'image') {
      updatedBackground.image = imageURL;
    }

    onUpdate(updatedBackground);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="background-picker-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="background-picker-dialog-title">Select Slide Background</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup value={backgroundStyle} onChange={handleStyleChange} aria-label="background-style" name="background-style">
            <FormControlLabel value="solid" control={<Radio />} label="Solid Color" />
            <FormControlLabel value="gradient" control={<Radio />} label="Gradient" />
            <FormControlLabel value="image" control={<Radio />} label="Image" />
          </RadioGroup>
        </FormControl>

        {backgroundStyle === 'solid' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Select Color:</Typography>
            <SketchPicker color={solidColor} onChangeComplete={handleSolidColorChange} />
          </Box>
        )}

        {backgroundStyle === 'gradient' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Gradient Direction:</Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <RadioGroup value={gradientDirection} onChange={handleGradientDirectionChange} row>
                <FormControlLabel value="to right" control={<Radio />} label="Left to Right" />
                <FormControlLabel value="to bottom" control={<Radio />} label="Top to Bottom" />
                <FormControlLabel value="45deg" control={<Radio />} label="Diagonal" />
              </RadioGroup>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Gradient Colors:</Typography>
            {gradientColors.map((color, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <SketchPicker
                  color={color}
                  onChangeComplete={(updatedColor) => handleGradientColorChange(index, updatedColor)}
                />
                {gradientColors.length > 2 && (
                  <Button
                    onClick={() => handleRemoveGradientColor(index)}
                    color="error"
                    sx={{ ml: 2 }}
                    aria-label={`Remove color ${index + 1}`}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            {gradientColors.length < 5 && (
              <Button onClick={handleAddGradientColor} sx={{ mt: 2 }} aria-label="Add Gradient Color">
                Add Color
              </Button>
            )}
          </Box>
        )}

        {backgroundStyle === 'image' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Image URL:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={imageURL}
              onChange={handleImageURLChange}
              placeholder="Enter image URL"
              sx={{ mt: 1 }}
              aria-label="Image URL Input"
            />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Ensure the image URL is publicly accessible.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel Background Selection">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Save Background Selection">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BackgroundPickerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentBackground: PropTypes.shape({
    style: PropTypes.oneOf(['solid', 'gradient', 'image']),
    color: PropTypes.string,
    gradient: PropTypes.shape({
      direction: PropTypes.string,
      colors: PropTypes.arrayOf(PropTypes.string),
    }),
    image: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

BackgroundPickerModal.defaultProps = {
  currentBackground: {
    style: 'solid',
    color: '#ffffff',
    gradient: {
      direction: 'to right',
      colors: ['#ff7e5f', '#feb47b'],
    },
    image: '',
  },
};

export default BackgroundPickerModal;
