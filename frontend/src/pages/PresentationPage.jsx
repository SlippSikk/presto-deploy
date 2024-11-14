import { useState, useContext, useEffect } from 'react';
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
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';
import SlideControls from '../components/SlideControls';
import SlideEditor from '../components/SlideEditor';
import SlideNumber from '../components/SlideNumber'; // Import SlideNumber

// Import react-beautiful-dnd components
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

// Import SlideThumbnail
import SlideThumbnail from '../components/SlideThumbnail';

const PresentationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Initialize useSearchParams

  const {
    store,
    error,
    addSlide,
    updatePresentation,
    deletePresentation,
    updateSlide,
    deleteSlide,
    reorderSlides, // Ensure this function is available in StoreContext
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
      setDialogError(`Failed to add slide ${err}`);
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
      setDialogError('There is only 1 slide in this presentation. Did you want to delete the presentation instead?');
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
          console.log(err);
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
   * Handle drag end for rearranging slides
   */
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If the item was dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Reorder slides array
    const reorderedSlides = Array.from(slides);
    const [movedSlide] = reorderedSlides.splice(source.index, 1);
    reorderedSlides.splice(destination.index, 0, movedSlide);

    // Persist the reordered slides to the store
    try {
      await reorderSlides(id, reorderedSlides);
    } catch (err) {
      setDialogError('Failed to reorder slides.');
      console.log(err);
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
          + New Slide
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteSlide}>
          Delete Slide
        </Button>
        <Button variant="outlined" onClick={() => setOpenRearrangeDialog(true)}>
          Arrange Slides
        </Button>
      </Box>

      {/* Slide Re-arranging Dialog */}
      <Dialog
        open={openRearrangeDialog}
        onClose={() => setOpenRearrangeDialog(false)}
        fullWidth
        maxWidth="lg" // Increased to accommodate multiple rows
      >
        <DialogTitle>Rearrange Slides</DialogTitle>
        <DialogContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="slidesDroppable" direction="horizontal">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allow slides to wrap into multiple rows
                    padding: 2,
                    justifyContent: 'flex-start', // Align items to the start
                  }}
                >
                  {slides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            width: 120, // Reduced width
                            height: 70, // Reduced height
                            margin: 1, // Uniform margin around slides
                            padding: 1,
                            border: '2px solid #1976d2',
                            borderRadius: 2,
                            backgroundColor: snapshot.isDragging
                              ? '#e3f2fd'
                              : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'grab',
                            userSelect: 'none',
                            boxShadow: snapshot.isDragging
                              ? '0 4px 8px rgba(0,0,0,0.2)'
                              : 'none',
                            transition: 'background-color 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              borderColor: '#115293',
                            },
                          }}
                        >
                          <SlideThumbnail slide={slide} index={index + 1} />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
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
