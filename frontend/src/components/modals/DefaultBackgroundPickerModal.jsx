// src/components/modals/DefaultBackgroundPickerModal.jsx

import React, { useState, useEffect, useContext } from 'react';
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
  Stack,
} from '@mui/material';
import { SketchPicker } from 'react-color';
import { StoreContext } from '../../context/StoreContext';

/**
 * DefaultBackgroundPickerModal allows users to set the default background for the presentation.
 *
 * @param {object} props - React props.
 * @param {boolean} props.open - Whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {string} props.presentationId - ID of the current presentation.
 * @returns {JSX.Element} DefaultBackgroundPickerModal component.
 */
const DefaultBackgroundPickerModal = ({ open, onClose, presentationId }) => {
  const { store, updateDefaultBackground } = useContext(StoreContext);
  const presentation = store.presentations.find((p) => p.id === presentationId);

  // Initialize with defaultBackground or fallback values
  const [backgroundStyle, setBackgroundStyle] = useState('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [gradientColors, setGradientColors] = useState(['#ff7e5f', '#feb47b']);
  const [imageURL, setImageURL] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    if (presentation && presentation.defaultBackground) {
      setBackgroundStyle(presentation.defaultBackground.style || 'solid');
      setSolidColor(presentation.defaultBackground.color || '#ffffff');
      setGradientDirection(presentation.defaultBackground.gradient?.direction || 'to right');
      setGradientColors(presentation.defaultBackground.gradient?.colors || ['#ff7e5f', '#feb47b']);
      setImageURL(presentation.defaultBackground.image || '');
      setUploadedImage(presentation.defaultBackground.uploadedImage || '');
    } else {
      // Reset to defaults if not available
      setBackgroundStyle('solid');
      setSolidColor('#ffffff');
      setGradientDirection('to right');
      setGradientColors(['#ff7e5f', '#feb47b']);
      setImageURL('');
      setUploadedImage('');
    }
  }, [presentation, open]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="default-background-picker-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="default-background-picker-dialog-title">Set Default Presentation Background</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup value={backgroundStyle} onChange={handleStyleChange} aria-label="default-background-style" name="default-background-style">
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
            <Typography variant="subtitle1">Image Selection:</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }} alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                value={imageURL}
                onChange={handleImageURLChange}
                placeholder="Enter image URL"
                aria-label="Default Image URL Input"
              />
              <Typography variant="body2">OR</Typography>
              <Button variant="contained" component="label" aria-label="Upload Default Image">
                Upload Image
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>
            </Stack>
            {uploadedImage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Uploaded Image Preview:</Typography>
                <img src={uploadedImage} alt="Uploaded Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              </Box>
            )}
            {!uploadedImage && imageURL && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Image Preview:</Typography>
                <img src={imageURL} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              </Box>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Ensure the image URL is publicly accessible.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel Default Background Selection">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Save Default Background Selection">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DefaultBackgroundPickerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  presentationId: PropTypes.string.isRequired,
};

export default DefaultBackgroundPickerModal;
