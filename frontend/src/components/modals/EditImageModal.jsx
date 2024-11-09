// src/components/modals/EditImageModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const EditImageModal = ({ open, onClose, element, onUpdate }) => {
  const [src, setSrc] = useState(element.src);
  const [alt, setAlt] = useState(element.alt || '');

  const handleSubmit = () => {
    const updatedElement = { ...element, src, alt };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Image Element</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Image URL"
          type="text"
          fullWidth
          variant="standard"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Alt Text"
          type="text"
          fullWidth
          variant="standard"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
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
