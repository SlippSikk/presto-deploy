// src/components/modals/EditVideoModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';

const EditVideoModal = ({ open, onClose, element, onUpdate }) => {
  const [src, setSrc] = useState(element.src);
  const [autoPlay, setAutoPlay] = useState(element.autoPlay || false);

  const handleSubmit = () => {
    const updatedElement = { ...element, src, autoPlay };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Video Element</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Video URL"
          type="text"
          fullWidth
          variant="standard"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              color="primary"
            />
          }
          label="Auto Play"
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

EditVideoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditVideoModal;
