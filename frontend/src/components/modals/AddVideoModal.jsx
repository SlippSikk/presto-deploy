// src/components/modals/AddVideoModal.jsx

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
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const AddVideoModal = ({ open, onClose, onAdd }) => {
  const [src, setSrc] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [sizeWidth, setSizeWidth] = useState(50);
  const [sizeHeight, setSizeHeight] = useState(30);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!src.trim()) {
      setError('Video URL cannot be empty');
      return;
    }
    // Basic validation for YouTube embed URL
    if (!src.startsWith('https://www.youtube.com/embed/')) {
      setError('Please provide a valid YouTube embed URL.');
      return;
    }
    onAdd('video', { src, autoPlay, size: { width: sizeWidth, height: sizeHeight } });
    // Reset fields
    setSrc('');
    setAutoPlay(false);
    setSizeWidth(50);
    setSizeHeight(30);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Video</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="YouTube Embed URL"
              fullWidth
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              required
              aria-label="Video URL"
              placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />}
              label="Auto-Play"
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

AddVideoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddVideoModal;
