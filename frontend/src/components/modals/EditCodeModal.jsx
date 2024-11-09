// src/components/modals/EditCodeModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, Select, MenuItem } from '@mui/material';

const EditCodeModal = ({ open, onClose, element, onUpdate }) => {
  const [code, setCode] = useState(element.code);
  const [language, setLanguage] = useState(element.language || 'javascript');
  const [fontSize, setFontSize] = useState(element.fontSize || 1);

  const handleSubmit = () => {
    const updatedElement = { ...element, code, language, fontSize };
    onUpdate(updatedElement);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Code Element</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Code"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="standard"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <InputLabel sx={{ mt: 2 }}>Language</InputLabel>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          fullWidth
          variant="standard"
        >
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="csharp">C#</MenuItem>
          {/* Add more languages as needed */}
        </Select>
        <TextField
          margin="dense"
          label="Font Size"
          type="number"
          fullWidth
          variant="standard"
          value={fontSize}
          onChange={(e) => setFontSize(parseFloat(e.target.value))}
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

EditCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditCodeModal;
