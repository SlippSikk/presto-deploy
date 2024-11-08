import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  IconButton,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';
import SlideControls from '../components/SlideControls';
import SlideNumber from '../components/SlideNumber';
import {
  getStore,
  setStore,
} from '../services/api';


/**
 * PresentationPage component for viewing and editing a specific presentation.
 */
const PresentationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    store,
    error,
    addSlide,
    updatePresentation,
    deletePresentation,
    updateSlide,
    deleteSlide,
  } = useContext(StoreContext);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditTitleDialog, setOpenEditTitleDialog] = useState(false);
  const [openEditThumbnailDialog, setOpenEditThumbnailDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('');
  const [dialogError, setDialogError] = useState('');

  const presentation = store.presentations.find((p) => p.id === id);

  if (!presentation) {
    return (
      <Container>
        <Typography variant="h6">Presentation not found.</Typography>
      </Container>
    );
  }

  const currentSlide = presentation.slides[currentSlideIndex] || {};

  /**
   * Handles the deletion of the entire presentation.
   */
  const handleDeletePresentation = async () => {
    try {
      await deletePresentation(id);
      navigate('/dashboard');
    } catch (err) {
      setDialogError('Failed to delete presentation.');
    }
  };

  /**
   * Handles updating the presentation title.
   */
  const handleUpdateTitle = async () => {
    if (!newTitle.trim()) {
      setDialogError('Title cannot be empty');
      return;
    }
    const updatedPresentation = { ...presentation, name: newTitle };
    try {
      await updatePresentation(id, updatedPresentation);
      setOpenEditTitleDialog(false);
      setNewTitle('');
      setDialogError('');
    } catch (err) {
      setDialogError('Failed to update title');
    }
  };

  /**
   * Handles updating the presentation thumbnail.
   */
  const handleUpdateThumbnail = async () => {
    const updatedPresentation = { ...presentation, thumbnail: newThumbnailUrl };
    try {
      await updatePresentation(id, updatedPresentation);
      setOpenEditThumbnailDialog(false);
      setNewThumbnailUrl('');
      setDialogError('');
    } catch (err) {
      setDialogError('Failed to update thumbnail');
    }
  };

  /**
   * Handles adding a new slide to the presentation.
   */
  const handleAddSlide = async () => {
    const newSlide = {
      id: `slide-${Date.now()}`, // Simple unique ID; consider using UUID in production
      content: '',
    };
    try {
      await addSlide(id, newSlide);
      setCurrentSlideIndex(presentation.slides.length); // Navigate to the new slide
    } catch (err) {
      setDialogError('Failed to add slide');
    }
  };

  /**
   * Handles deleting the current slide.
   */
  const handleDeleteSlide = async () => {
    if (presentation.slides.length === 1) {
      setDialogError('Cannot delete the only slide.');
      return;
    }
    const slideId = currentSlide.id;
    try {
      await deleteSlide(id, slideId);
      setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      setDialogError('Failed to delete slide');
    }
  };

  /**
   * Handles updating the content of the current slide.
   *
   * @param {string} newContent - The updated content for the slide.
   */
  const handleUpdateSlideContent = async (newContent) => {
    const updatedSlide = { ...currentSlide, content: newContent };
    try {
      await updateSlide(id, currentSlide.id, updatedSlide);
    } catch (err) {
      setDialogError('Failed to update slide content');
    }
  };

  /**
   * Navigates back to the dashboard.
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  /**
   * Handles navigation to the previous slide.
   */
  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  /**
   * Handles navigation to the next slide.
   */
  const handleNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {presentation.name}
        <IconButton
          size="small"
          onClick={() => setOpenEditTitleDialog(true)}
          aria-label="Edit Title"
          sx={{ ml: 1 }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => setOpenEditThumbnailDialog(true)}
          aria-label="Edit Thumbnail"
          sx={{ ml: 1 }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => {}}>
          {error}
        </Alert>
      )}
      {dialogError && (
        <Alert severity="error" onClose={() => setDialogError('')}>
          {dialogError}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
        <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)}>
          Delete Presentation
        </Button>
      </Box>

      {/* Slide Content */}
      <Box
        sx={{
          position: 'relative',
          border: '1px solid #ccc',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5">{currentSlide.content || 'Empty Slide'}</Typography>
        <SlideNumber current={currentSlideIndex + 1} total={presentation.slides.length} />
      </Box>

      {/* Slide Controls */}
      <SlideControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={presentation.slides.length}
        onPrevious={handlePreviousSlide}
        onNext={handleNextSlide}
      />

      {/* Add and Delete Slide Buttons */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={handleAddSlide}>
          Add Slide
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteSlide}>
          Delete Slide
        </Button>
      </Box>

      {/* Delete Presentation Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Are you sure you want to delete this presentation?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>No</Button>
          <Button onClick={handleDeletePresentation} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Title Dialog */}
      <Dialog open={openEditTitleDialog} onClose={() => setOpenEditTitleDialog(false)}>
        <DialogTitle>Edit Presentation Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Title"
            type="text"
            fullWidth
            variant="standard"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            aria-label="New Title"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditTitleDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTitle} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Thumbnail Dialog */}
      <Dialog open={openEditThumbnailDialog} onClose={() => setOpenEditThumbnailDialog(false)}>
        <DialogTitle>Edit Presentation Thumbnail</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Thumbnail URL"
            type="url"
            fullWidth
            variant="standard"
            value={newThumbnailUrl}
            onChange={(e) => setNewThumbnailUrl(e.target.value)}
            aria-label="Thumbnail URL"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditThumbnailDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateThumbnail} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PresentationPage;
