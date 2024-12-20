import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';

const AddTextModal = ({ open, onClose, onAdd }) => {
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState(1);
  const [color, setColor] = useState('#000000');
  const [sizeWidth, setSizeWidth] = useState(30);
  const [sizeHeight, setSizeHeight] = useState(10);
  const [error, setError] = useState('');

  const validateHex = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);

  const handleAdd = () => {
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    if (!validateHex(color)) {
      setError('Invalid HEX color code');
      return;
    }
    onAdd('text', { content, fontSize, color, size: { width: sizeWidth, height: sizeHeight } });
    // Reset fields
    setContent('');
    setFontSize(1);
    setColor('#000000');
    setSizeWidth(30);
    setSizeHeight(10);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Text</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              inputProps={{ "data-testid": "content-input" }}
              aria-label="Text Content"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Font Size (em)"
              type="number"
              inputProps={{ step: 0.1, min: 0.5, max: 5, "data-testid": "font-size-input" }}
              fullWidth
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              aria-label="Font Size"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Color (HEX)"
              type="text"
              inputProps={{ "data-testid": "color-input" }}
              fullWidth
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#000000"
              aria-label="Text Color"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Width (%)"
              type="number"
              inputProps={{ min: 1, max: 100, "data-testid": "width-percentage-input"}}
              fullWidth
              value={sizeWidth}v
              onChange={(e) => setSizeWidth(parseInt(e.target.value, 10))}
              aria-label="Width Percentage"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Height (%)"
              type="number"
              inputProps={{ min: 1, max: 100, "data-testid": "height-percentage-input" }}
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

AddTextModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddTextModal;
