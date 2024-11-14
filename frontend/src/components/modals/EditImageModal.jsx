
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';

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
        const updatedElement = {
          ...element,
          src: reader.result,
          alt,
          // size remains unchanged
        };
        onUpdate(updatedElement);
        setFile(null);
        setError('');
        onClose();
      };
      reader.readAsDataURL(file);
    } else {
      const updatedElement = {
        ...element,
        src,
        alt,
        // size remains unchanged
      };
      onUpdate(updatedElement);
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Image Element</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="subtitle1">Choose Image Source</Typography>

          <TextField
            label="Image URL"
            fullWidth
            value={src}
            onChange={(e) => {
              setSrc(e.target.value);
              setFile(null); // Clear file if URL is entered
              setError(''); // Clear error when user starts typing
            }}
            disabled={file !== null}
            aria-label="Image URL"
          />

          <Button variant="contained" component="label" fullWidth>
            Upload File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              aria-label="Upload Image File"
            />
          </Button>
          {file && (
            <Typography variant="body2" color="textSecondary">
              Selected File: {file.name}
            </Typography>
          )}

          <TextField
            label="Alt Text"
            fullWidth
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            aria-label="Alt Text"
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel Editing Image">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Save Image Changes">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditImageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    // size is kept but not used in the modal
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditImageModal;
