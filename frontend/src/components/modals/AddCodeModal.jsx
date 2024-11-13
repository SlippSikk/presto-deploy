// src/components/modals/AddCodeModal.jsx

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

const AddCodeModal = ({ open, onClose, onAdd }) => {
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(1);
  const [sizeWidth, setSizeWidth] = useState(50);
  const [sizeHeight, setSizeHeight] = useState(30);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }
    onAdd('code', { code, fontSize, size: { width: sizeWidth, height: sizeHeight } });
    // Reset fields
    setCode('');
    setFontSize(1);
    setSizeWidth(50);
    setSizeHeight(30);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Code Block</DialogTitle>
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
            label="Code"
            fullWidth
            multiline
            rows={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            aria-label="Code Content"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Width (%)"
              type="number"
              inputProps={{ min: 1, max: 100 }}
              fullWidth
              value={sizeWidth}
              onChange={(e) => setSizeWidth(parseInt(e.target.value, 10))}
              aria-label="Width Percentage"
            />
            <TextField
              label="Height (%)"
              type="number"
              inputProps={{ min: 1, max: 100 }}
              fullWidth
              value={sizeHeight}
              onChange={(e) => setSizeHeight(parseInt(e.target.value, 10))}
              aria-label="Height Percentage"
            />
          </Box>
          {error && (
            <Box sx={{ color: 'red' }}>
              {error}
            </Box>
          )}
        </Box>
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

AddCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddCodeModal;
