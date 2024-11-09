// src/pages/PresentationPage.jsx

import React, { useState, useContext, useEffect } from 'react';
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
import SlideEditor from '../components/SlideEditor';

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
  const currentSlide =
    Array.isArray(presentation.slides) && presentation.slides.length > 0
      ? presentation.slides[currentSlideIndex] || presentation.slides[0]
      : { id: `slide-${Date.now()}`, elements: [] };

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
      elements: [],
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

  const updateSlideHandler = async (presentationId, slideId, updatedSlide) => {
    await updateSlide(presentationId, slideId, updatedSlide);
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

