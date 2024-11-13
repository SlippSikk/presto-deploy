// src/components/modals/BackgroundPickerModal.jsx

import React, { useState } from 'react';
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

const BackgroundPickerModal = ({ open, onClose, currentBackground, onUpdate }) => {
  const [backgroundStyle, setBackgroundStyle] = useState(currentBackground.style);
  const [solidColor, setSolidColor] = useState(currentBackground.color || '#ffffff');
  const [gradientDirection, setGradientDirection] = useState(currentBackground.gradient?.direction || 'to right');
  const [gradientColors, setGradientColors] = useState(currentBackground.gradient?.colors || ['#ff7e5f', '#feb47b']);
  const [imageURL, setImageURL] = useState(currentBackground.image || '');

  const handleStyleChange = (e) => {
    setBackgroundStyle(e.target.value);
  };

  const handleSolidColorChange = (color) => {
    setSolidColor(color.hex);
  };

  const handleGradientDirectionChange = (e) => {
    setGradientDirection(e.target.value);
  };

  const handleGradientColorChange = (index, color) => {
    const newColors = [...gradientColors];
    newColors[index] = color.hex;
    setGradientColors(newColors);
  };

  const handleAddGradientColor = () => {
    if (gradientColors.length < 5) { // Limit to 5 colors
      setGradientColors([...gradientColors, '#000000']);
    }
  };

  const handleRemoveGradientColor = (index) => {
    const newColors = gradientColors.filter((_, i) => i !== index);
    setGradientColors(newColors);
  };

  const handleImageURLChange = (e) => {
    setImageURL(e.target.value);
  };

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
    style: PropTypes.oneOf(['solid', 'gradient', 'image']).isRequired,
    color: PropTypes.string,
    gradient: PropTypes.shape({
      direction: PropTypes.string,
      colors: PropTypes.arrayOf(PropTypes.string),
    }),
    image: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default BackgroundPickerModal;
