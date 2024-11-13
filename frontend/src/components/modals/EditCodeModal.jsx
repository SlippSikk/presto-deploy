// src/components/modals/EditCodeModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

const EditCodeModal = ({ open, onClose, element, onUpdate }) => {
  const [code, setCode] = useState(element.code);
  const [fontSize, setFontSize] = useState(element.fontSize || 1);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }
    const updatedElement = {
      ...element,
      code,
      fontSize,
    };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Code Element</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Code"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="standard"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label="Code Content"
          />
          <Box>
            <TextField
              label="Font Size (em)"
              type="number"
              inputProps={{ step: 0.1, min: 0.5, max: 5 }}
              fullWidth
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              aria-label="Font Size"
            />
          </Box>
          {error && (
            <Box sx={{ color: 'red', mt: 1 }}>
              {error}
            </Box>
          )}
        </Box>
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

EditCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditCodeModal;
