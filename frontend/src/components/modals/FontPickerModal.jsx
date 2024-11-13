// src/components/modals/FontPickerModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const FONT_FAMILIES = ['Arial', 'Times New Roman', 'Courier New'];

const FontPickerModal = ({ open, onClose, currentFont, onUpdate }) => {
  const [selectedFont, setSelectedFont] = useState(currentFont);

  const handleChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleSubmit = () => {
    onUpdate(selectedFont);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Font Family</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            value={selectedFont}
            label="Font Family"
            onChange={handleChange}
          >
            {FONT_FAMILIES.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

FontPickerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentFont: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default FontPickerModal;
