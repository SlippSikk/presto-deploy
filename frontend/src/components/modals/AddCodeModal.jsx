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
  Grid,
  MenuItem,
} from '@mui/material';

const AddCodeModal = ({ open, onClose, onAdd }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(1);
  const [sizeWidth, setSizeWidth] = useState(50);
  const [sizeHeight, setSizeHeight] = useState(30);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }
    onAdd('code', { code, language, fontSize, size: { width: sizeWidth, height: sizeHeight } });
    // Reset fields
    setCode('');
    setLanguage('javascript');
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
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Language"
              fullWidth
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Programming Language"
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="c">C</MenuItem>
            </TextField>
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

AddCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddCodeModal;
