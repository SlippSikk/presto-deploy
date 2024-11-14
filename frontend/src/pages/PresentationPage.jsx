// src/pages/PresentationPage.jsx

import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit, ArrowBack, DragIndicator } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';
import SlideControls from '../components/SlideControls';
import SlideEditor from '../components/SlideEditor';
import SlideNumber from '../components/SlideNumber'; // Import SlideNumber

// Import @dnd-kit components
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '../components/SortableItem'; // We'll create this component

const PresentationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    store,
    error,
    addSlide,
    updatePresentation,
    deletePresentation,
    updateSlide,
    deleteSlide,
    reorderSlides,
  } = useContext(StoreContext);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditTitleDialog, setOpenEditTitleDialog] = useState(false);
  const [openEditThumbnailDialog, setOpenEditThumbnailDialog] = useState(false);
  const [openRearrangeDialog, setOpenRearrangeDialog] = useState(false); // State for rearrange dialog
  const [newTitle, setNewTitle] = useState('');
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [dialogError, setDialogError] = useState('');

  const defaultThumbnail = '/assets/default-thumbnail.jpg';
  const presentation = store.presentations.find((p) => p.id === id);

  /**
   * Effect: Synchronize currentSlideIndex with the URL's 'slide' parameter
   */
  useEffect(() => {
    if (presentation && Array.isArray(presentation.slides)) {
      const slideParam = parseInt(searchParams.get('slide'), 10);
      if (!isNaN(slideParam) && slideParam >= 1 && slideParam <= presentation.slides.length) {
        setCurrentSlideIndex(slideParam - 1); // Convert to 0-based index
      } else {
        // If 'slide' param is invalid or missing, default to first slide and update URL
        setCurrentSlideIndex(0);
        if (!slideParam || slideParam < 1 || slideParam > presentation.slides.length) {
          setSearchParams({ slide: 1 }, { replace: true });
        }
      }
    }
  }, [presentation, searchParams, setSearchParams]);

  if (!presentation) {
    return (
      <Container>
        <Typography variant="h6">Presentation not found.</Typography>
      </Container>
    );
  }

  const currentThumbnail = presentation.thumbnail || defaultThumbnail;
  const slides = Array.isArray(presentation.slides) ? presentation.slides : [];
  const currentSlide =
    slides.length > 0 ? slides[currentSlideIndex] || slides[0] : { id: `slide-${Date.now()}`, elements: [], fontFamily: 'Arial' };

  /**
   * Handle adding a new slide
   */
  const handleAddSlide = async () => {
    try {
      await addSlide(id);
      
      // After adding, navigate to the new slide by updating the 'slide' param
      const newSlideIndex = slides.length; // Since a new slide is appended
      setSearchParams({ slide: newSlideIndex + 1 }, { replace: true });
    } catch (err) {
      setDialogError('Failed to add slide');
    }
  };

  /**
   * Handle deleting the current slide
   */
  const handleDeleteSlide = async () => {
    const slideId = currentSlide.id;

    try {
      await deleteSlide(id, slideId);
      
      const updatedSlides = slides.filter((slide) => slide.id !== slideId);
      const updatedSlideCount = updatedSlides.length;

      if (updatedSlideCount === 0) {
        // Prevent deleting the last slide
        setDialogError('Cannot delete the last slide.');
        return;
      }

      // Determine the new slide index
      let newSlideIndex = currentSlideIndex;
      if (currentSlideIndex >= updatedSlideCount) {
        newSlideIndex = updatedSlideCount - 1;
      }

      setSearchParams({ slide: newSlideIndex + 1 }, { replace: true });
    } catch (err) {
      setDialogError('Failed to delete slide.');
    }
  };

  /**
   * Handle deleting the entire presentation
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
   * Handle updating the presentation title
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
   * Handle updating the presentation thumbnail
   */
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

  /**
   * Navigate back to the dashboard
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  /**
   * Handler to update a slide, passed down to SlideEditor
   */
  const updateSlideHandler = async (presentationId, slideId, updatedSlide) => {
    await updateSlide(presentationId, slideId, updatedSlide);
  };

  /**
   * Handle drag end for rearranging slides using @dnd-kit
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex((slide) => slide.id === active.id);
      const newIndex = slides.findIndex((slide) => slide.id === over?.id);

      const newSlides = arrayMove(slides, oldIndex, newIndex);

      try {
        await reorderSlides(id, newSlides);
      } catch (err) {
        setDialogError('Failed to reorder slides.');
      }
    }
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

      {/* Transition Type Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Transition Type
        </Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="transition-type-select-label">Transition</InputLabel>
          <Select
            labelId="transition-type-select-label"
            id="transition-type-select"
            value={presentation.transitionType || 'none'}
            label="Transition"
            onChange={(e) => {
              const newTransitionType = e.target.value;
              // Implement a function to update the transition type in the store
              // For example:
              // updateTransitionType(id, newTransitionType);
            }}
            aria-label="Transition Type Selector"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="fade">Fade</MenuItem>
            <MenuItem value="slideLeft">Slide Left</MenuItem>
            <MenuItem value="slideRight">Slide Right</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alerts */}
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
      <Box sx={{ position: 'relative' }}>
        <SlideEditor presentationId={id} slide={currentSlide} updateSlide={updateSlideHandler} />
        <SlideNumber
          current={currentSlideIndex + 1}
          total={slides.length}
          sx={{ position: 'absolute', bottom: 8, right: 16 }} // Position SlideNumber
        />
      </Box>

      {/* Slide Controls */}
      <SlideControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
        onPrevious={() => {
          if (currentSlideIndex > 0) {
            const newIndex = currentSlideIndex - 1;
            setSearchParams({ slide: newIndex + 1 }, { replace: true });
          }
        }}
        onNext={() => {
          if (currentSlideIndex < slides.length - 1) {
            const newIndex = currentSlideIndex + 1;
            setSearchParams({ slide: newIndex + 1 }, { replace: true });
          }
        }}
      />

      {/* Add, Delete, and Rearrange Slide Buttons */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" onClick={handleAddSlide}>
          Add Slide
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteSlide}>
          Delete Slide
        </Button>
        <Button variant="outlined" onClick={() => setOpenRearrangeDialog(true)}>
          Rearrange Slides
        </Button>
      </Box>

      {/* Slide Re-arranging Dialog */}
      <Dialog
        open={openRearrangeDialog}
        onClose={() => setOpenRearrangeDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Rearrange Slides</DialogTitle>
        <DialogContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map((slide) => slide.id)}
              strategy={verticalListSortingStrategy}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: 2,
                }}
              >
                {slides.map((slide, index) => (
                  <SortableItem key={slide.id} id={slide.id} index={index + 1}>
                    <Box
                      sx={{
                        width: '160px', // Fixed width
                        height: '90px', // Fixed height
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        cursor: 'grab',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <SlideThumbnail slide={slide} index={index + 1} />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: '#ffffff',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                          },
                        }}
                        size="small"
                        aria-label="Drag Handle"
                        {...slide.dragHandleProps} // Spread the drag handle props
                      >
                        <DragIndicator />
                      </IconButton>
                    </Box>
                  </SortableItem>
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRearrangeDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
            aria-label="Upload Thumbnail"
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
