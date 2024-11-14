import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Stack,
} from '@mui/material';

const EditVideoModal = ({ open, onClose, element, onUpdate }) => {
  const [src, setSrc] = useState(element.src);
  const [autoPlay, setAutoPlay] = useState(element.autoPlay || false);
  const [error, setError] = useState('');

  // Helper function to validate YouTube embed URLs
  const validateYouTubeEmbedURL = (url) => {
    const regex = /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}(\?.*)?$/;
    return regex.test(url);
  };

  const handleSubmit = () => {
    if (!src.trim()) {
      setError('Video URL cannot be empty');
      return;
    }
    if (!validateYouTubeEmbedURL(src)) {
      setError('Invalid YouTube embed URL. It should follow the format: https://www.youtube.com/embed/VIDEO_ID');
      return;
    }

    const updatedElement = { ...element, src, autoPlay };
    onUpdate(updatedElement);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Video Element</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Video URL"
            type="text"
            fullWidth
            variant="outlined"
            value={src}
            onChange={(e) => {
              setSrc(e.target.value);
              setError(''); // Clear error when user starts typing
            }}
            placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
            aria-label="Video URL"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                color="primary"
                aria-label="Auto Play Checkbox"
              />
            }
            label="Auto Play"
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel Editing Video">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Save Video Changes">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditVideoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    autoPlay: PropTypes.bool,
    // size is kept but not used in the modal
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditVideoModal;
