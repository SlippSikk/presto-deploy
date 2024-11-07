import React, { useState, useEffect } from 'react';
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
import {
  getPresentationById,
  updatePresentation,
  deletePresentation,
  addSlide,
  updateSlide,
  deleteSlide,
} from '../services/presentationApi';

import SlideControls from '../components/SlideControls';
import SlideNumber from '../components/SlideNumber';

/**
 * PresentationPage component for viewing and editing a specific presentation.
 */
const PresentationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditTitleDialog, setOpenEditTitleDialog] = useState(false);
  const [openEditThumbnailDialog, setOpenEditThumbnailDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPresentation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
      if (e.key === 'ArrowRight' && currentSlideIndex < presentation.slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, presentation?.slides.length]);

  /**
   * Fetches the presentation data by ID.
   */
  const fetchPresentation = async () => {
    try {
      const response = await getPresentationById(id);
      setPresentation(response.data.presentation);
      setCurrentSlideIndex(0);
    } catch (err) {
      setError('Failed to load presentation');
    }
  };

  /**
   * Handles the deletion of the entire presentation.
   */
  const handleDeletePresentation = async () => {
    try {
      await deletePresentation(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete presentation');
    }
  };

  /**
   * Handles updating the presentation title.
   */
  const handleUpdateTitle = async () => {
    if (!newTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    try {
      await updatePresentation(id, { name: newTitle });
      setPresentation({ ...presentation, name: newTitle });
      setOpenEditTitleDialog(false);
      setNewTitle('');
      setError('');
    } catch (err) {
      setError('Failed to update title');
    }
  };

  /**
   * Handles updating the presentation thumbnail.
   */
  const handleUpdateThumbnail = async () => {
    try {
      await updatePresentation(id, { thumbnail: newThumbnailUrl });
      setPresentation({ ...presentation, thumbnail: newThumbnailUrl });
      setOpenEditThumbnailDialog(false);
      setNewThumbnailUrl('');
    } catch (err) {
      setError('Failed to update thumbnail');
    }
  };

  /**
   * Handles adding a new slide to the presentation.
   */
  const handleAddSlide = async () => {
    try {
      const response = await addSlide(id, '');
      setPresentation({
        ...presentation,
        slides: [...presentation.slides, response.data.slide],
      });
      setCurrentSlideIndex(presentation.slides.length);
    } catch (err) {
      setError('Failed to add slide');
    }
  };

  /**
   * Handles deleting the current slide.
   */
  const handleDeleteSlide = async () => {
    if (presentation.slides.length === 1) {
      setError('Cannot delete the only slide. Consider deleting the presentation.');
      return;
    }
    try {
      const slideId = presentation.slides[currentSlideIndex].id;
      await deleteSlide(id, slideId);
      const updatedSlides = presentation.slides.filter((_, idx) => idx !== currentSlideIndex);
      setPresentation({ ...presentation, slides: updatedSlides });
      setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      setError('Failed to delete slide');
    }
  };

  /**
   * Handles updating the content of the current slide.
   *
   * @param {string} newContent - The updated content for the slide.
   */
  const handleUpdateSlideContent = async (newContent) => {
    try {
      const slideId = presentation.slides[currentSlideIndex].id;
      await updateSlide(id, slideId, { content: newContent });
      const updatedSlides = presentation.slides.map((slide, idx) =>
        idx === currentSlideIndex ? { ...slide, content: newContent } : slide
      );
      setPresentation({ ...presentation, slides: updatedSlides });
    } catch (err) {
      setError('Failed to update slide');
    }
  };

  /**
   * Navigates back to the dashboard.
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!presentation) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const currentSlide = presentation.slides[currentSlideIndex];


};

export default PresentationPage;
