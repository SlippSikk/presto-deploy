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
import { Edit, ArrowBack } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';
import SlideControls from '../components/SlideControls';
import SlideNumber from '../components/SlideNumber';

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
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [dialogError, setDialogError] = useState('');

  const defaultThumbnail = '/assets/default-thumbnail.jpg';
  const presentation = store.presentations.find((p) => p.id === id);

  if (!presentation) {
    return (
      <Container>
        <Typography variant="h6">Presentation not found.</Typography>
      </Container>
    );
  }

  const currentThumbnail = presentation.thumbnail || defaultThumbnail;
  const currentSlide = presentation.slides[currentSlideIndex] || {};

  const handleDeletePresentation = async () => {
    try {
      await deletePresentation(id);
      navigate('/dashboard');
    } catch (err) {
      setDialogError('Failed to delete presentation.');
    }
  };

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

  const handleUpdateThumbnail = async () => {
    let thumbnailUrl = presentation.thumbnail;

    if (newThumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        thumbnailUrl = reader.result;
        const updatedPresentation = { ...presentation, thumbnail: thumbnailUrl };
        try {
          await updatePresentation(id, updatedPresentation);
          setOpenEditThumbnailDialog(false);
          setNewThumbnailFile(null);
          setDialogError('');
        } catch (err) {
          setDialogError('Failed to update thumbnail');
        }
      };
      reader.readAsDataURL(newThumbnailFile);
    } else {
      setDialogError('Please select an image file.');
    }
  };

  const handleAddSlide = async () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      content: '',
    };
    try {
      await addSlide(id, newSlide);
      setCurrentSlideIndex(presentation.slides.length);
    } catch (err) {
      setDialogError('Failed to add slide');
    }
  };

  const handleDeleteSlide = async () => {
    const slideId = currentSlide.id;
  
    try {
      await deleteSlide(id, slideId);
      setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      setDialogError(err.message);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Back Button and Delete Presentation Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button startIcon={<ArrowBack />} variant="contained" onClick={handleBack}>
          Back
        </Button>
        <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)}>
          Delete Presentation
        </Button>
      </Box>

      {/* Title Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Title
          <IconButton
            size="small"
            onClick={() => {
              setOpenEditTitleDialog(true);
              setNewTitle(presentation.name);
            }}
            aria-label="Edit Title"
            sx={{ ml: 1 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Typography>
        <Typography variant="h6">{presentation.name}</Typography>
      </Box>

      {/* Thumbnail Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Thumbnail
          <IconButton
            size="small"
            onClick={() => setOpenEditThumbnailDialog(true)}
            aria-label="Edit Thumbnail"
            sx={{ ml: 1 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Typography>
        <img src={currentThumbnail} alt="Thumbnail Preview" style={{ width: '100px', height: 'auto' }} />
      </Box>

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
          mb: 4,
        }}
      >
        <Typography variant="h5">{currentSlide.content || 'Empty Slide'}</Typography>
        <SlideNumber current={currentSlideIndex + 1} total={presentation.slides.length} />
      </Box>

      {/* Slide Controls */}
      <SlideControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={presentation.slides.length}
        onPrevious={() => setCurrentSlideIndex(currentSlideIndex - 1)}
        onNext={() => setCurrentSlideIndex(currentSlideIndex + 1)}
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewThumbnailFile(e.target.files[0])}
            style={{ marginTop: '10px' }}
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