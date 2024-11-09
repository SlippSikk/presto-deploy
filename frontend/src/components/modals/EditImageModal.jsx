// src/components/modals/EditImageModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography } from '@mui/material';

const EditImageModal = ({ open, onClose, element, onUpdate }) => {
  const [src, setSrc] = useState(element.src);
  const [alt, setAlt] = useState(element.alt || '');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSrc(''); // Clear URL if file is selected
  };

  const handleSubmit = () => {
    if (!src.trim() && !file) {
      setError('Either Image URL or File upload is required');
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedElement = { ...element, src: reader.result, alt };
        onUpdate(updatedElement);
        setFile(null);
        setError('');
        onClose();
      };
      reader.readAsDataURL(file);
    } else {
      const updatedElement = { ...element, src, alt };
      onUpdate(updatedElement);
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Image Element</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Choose Image Source</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Image URL"
              fullWidth
              value={src}
              onChange={(e) => {
                setSrc(e.target.value);
                setFile(null); // Clear file if URL is entered
              }}
              disabled={file !== null}
              aria-label="Image URL"
            />
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload File
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2">{file.name}</Typography>}
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

EditImageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditImageModal;
