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
    if (isNaN(fontSize) || fontSize < 0.5 || fontSize > 5) {
      setError('Font size must be between 0.5em and 5em');
      return;
    }

    const updatedElement = {
      ...element,
      content,
      fontSize,
      color,
      // size remains unchanged
    };
    onUpdate(updatedElement);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Text Element</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(''); // Clear error when user starts typing
            }}
            aria-label="Text Content"
          />

          <TextField
            label="Font Size (em)"
            type="number"
            inputProps={{ step: 0.1, min: 0.5, max: 5 }}
            fullWidth
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            aria-label="Font Size"
          />

          <TextField
            label="Color (HEX)"
            type="text"
            fullWidth
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#000000"
            aria-label="Text Color"
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel Editing Text">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Save Text Changes">
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
