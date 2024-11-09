// src/components/modals/EditTextModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

const EditTextModal = ({ open, onClose, element, onUpdate }) => {
  const [content, setContent] = useState(element.content);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [color, setColor] = useState(element.color);
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
    const updatedElement = { ...element, content, fontSize, color };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditTextModal;
