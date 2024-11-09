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
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EditCodeModal = ({ open, onClose, element, onUpdate }) => {
  const [code, setCode] = useState(element.code);
  const [language, setLanguage] = useState(element.language || 'javascript');
  const [fontSize, setFontSize] = useState(element.fontSize || 1);
  const [sizeWidth, setSizeWidth] = useState(element.size.width);
  const [sizeHeight, setSizeHeight] = useState(element.size.height);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }
    const updatedElement = {
      ...element,
      code,
      language,
      fontSize,
      size: { width: sizeWidth, height: sizeHeight },
    };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Code Element</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
              variant="standard"
              aria-label="Programming Language"
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="c">C</MenuItem>
            </Select>
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
