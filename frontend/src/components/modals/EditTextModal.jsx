// src/components/modals/EditTextModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, MenuItem, Select } from '@mui/material';

const EditTextModal = ({ open, onClose, element, onUpdate }) => {
  const [content, setContent] = useState(element.content);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [color, setColor] = useState(element.color);

  const handleSubmit = () => {
    const updatedElement = { ...element, content, fontSize, color };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Text Element</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Content"
          type="text"
          fullWidth
          variant="standard"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Font Size"
          type="number"
          fullWidth
          variant="standard"
          value={fontSize}
          onChange={(e) => setFontSize(parseFloat(e.target.value))}
        />
        <InputLabel sx={{ mt: 2 }}>Color</InputLabel>
        <Select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
          variant="standard"
        >
          <MenuItem value="#000000">Black</MenuItem>
          <MenuItem value="#FF0000">Red</MenuItem>
          <MenuItem value="#00FF00">Green</MenuItem>
          <MenuItem value="#0000FF">Blue</MenuItem>
          {/* Add more colors as needed */}
        </Select>
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
