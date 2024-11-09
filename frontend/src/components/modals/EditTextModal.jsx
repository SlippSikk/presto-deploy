// src/components/modals/EditTextModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';

// Optional: Import validation helper if you have one
// import { validateHex } from '../../utils/validateHex';

const EditTextModal = ({ open, onClose, element, onUpdate }) => {
  const [content, setContent] = useState(element.content);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [color, setColor] = useState(element.color);
  const [sizeWidth, setSizeWidth] = useState(element.size.width);
  const [sizeHeight, setSizeHeight] = useState(element.size.height);
  const [error, setError] = useState('');

  const validateHex = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    if (!validateHex(color)) {
      setError('Invalid HEX color code');
      return;
    }
    if (
      isNaN(sizeWidth) ||
      sizeWidth < 1 ||
      sizeWidth > 100 ||
      isNaN(sizeHeight) ||
      sizeHeight < 1 ||
      sizeHeight > 100
    ) {
      setError('Size dimensions must be between 1% and 100%');
      return;
    }

    const updatedElement = {
      ...element,
      content,
      fontSize,
      color,
      size: { width: sizeWidth, height: sizeHeight },
    };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Text Element</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="standard"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-label="Text Content"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Font Size (em)"
              type="number"
              inputProps={{ step: 0.1, min: 0.5, max: 5 }}
              fullWidth
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              aria-label="Font Size"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Color (HEX)"
              type="text"
              fullWidth
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#000000"
              aria-label="Text Color"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Width (%)"
              type="number"
              inputProps={{ min: 1, max: 100 }}
              fullWidth
              value={sizeWidth}
              onChange={(e) => setSizeWidth(parseInt(e.target.value, 10))}
              aria-label="Width Percentage"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Height (%)"
              type="number"
              inputProps={{ min: 1, max: 100 }}
              fullWidth
              value={sizeHeight}
              onChange={(e) => setSizeHeight(parseInt(e.target.value, 10))}
              aria-label="Height Percentage"
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <span style={{ color: 'red' }}>{error}</span>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditTextModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditTextModal;
