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
  Typography,
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
    <Dialog open={open} onClose={onClose} aria-labelledby="font-picker-dialog-title">
      <DialogTitle id="font-picker-dialog-title">Select Font Family</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            value={selectedFont}
            label="Font Family"
            onChange={handleChange}
            aria-label="Font Family Selector"
          >
            {FONT_FAMILIES.map((font) => (
              <MenuItem key={font} value={font}>
                <Typography style={{ fontFamily: font }}>{font}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel Font Selection">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Save Font Selection">
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
