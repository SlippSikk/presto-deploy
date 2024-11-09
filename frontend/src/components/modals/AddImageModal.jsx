// src/components/modals/AddImageModal.jsx

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

const AddImageModal = ({ open, onClose, onAdd }) => {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [sizeWidth, setSizeWidth] = useState(30);
  const [sizeHeight, setSizeHeight] = useState(30);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!src.trim()) {
      setError('Image URL cannot be empty');
      return;
    }
    onAdd('image', { src, alt, size: { width: sizeWidth, height: sizeHeight } });
    // Reset fields
    setSrc('');
    setAlt('');
    setSizeWidth(30);
    setSizeHeight(30);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Image</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              fullWidth
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              required
              aria-label="Image URL"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Alt Text"
              fullWidth
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              aria-label="Alt Text"
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
        <Button onClick={handleAdd} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddImageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddImageModal;
