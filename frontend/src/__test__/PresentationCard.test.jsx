// src/components/__tests__/PresentationCard.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import PresentationCard from '../components/PresentationCard';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('PresentationCard Component', () => {
    const mockPresentation = {
      id: '123',
      name: 'Test Presentation',
      thumbnail: 'https://via.placeholder.com/150',
      description: 'This is a mock presentation.',
      slides: [{ id: 'slide1', content: 'Slide 1 content' }],
    };
  
    it('renders presentation name, description, and slide count', () => {
      render(
        <Router>
          <PresentationCard presentation={mockPresentation} />
        </Router>
      );
  
      // Use getAllByText and expect specific counts
      const nameElements = screen.getAllByText(/Test Presentation/i);
      expect(nameElements).toHaveLength(1);
      expect(nameElements[0]).toBeInTheDocument();
  
      expect(screen.getByText(/This is a mock presentation./i)).toBeInTheDocument();
      expect(screen.getByText(/1 Slide/i)).toBeInTheDocument();
    });
  
    it('renders thumbnail image when available', () => {
      render(
        <Router>
          <PresentationCard presentation={mockPresentation} />
        </Router>
      );
  
      const imgElement = screen.getByAltText(/Test Presentation Thumbnail/i);
      expect(imgElement).toBeInTheDocument();
      expect(imgElement).toHaveAttribute('src', mockPresentation.thumbnail);
    });
  
    it('renders default thumbnail when no thumbnail is provided', () => {
      const presentationWithoutThumbnail = { ...mockPresentation, thumbnail: null };
      render(
        <Router>
          <PresentationCard presentation={presentationWithoutThumbnail} />
        </Router>
      );
  
      expect(screen.getByText(/No Thumbnail/i)).toBeInTheDocument();
    });
  
    it('opens presentation link correctly', () => {
      render(
        <Router>
          <PresentationCard presentation={mockPresentation} />
        </Router>
      );
  
      const openLink = screen.getByRole('link', { name: /Open/i });
      expect(openLink).toHaveAttribute('href', `/presentation/${mockPresentation.id}`);
    });
  
    it('renders multiple slides correctly', () => {
      const presentationWithMultipleSlides = {
        ...mockPresentation,
        slides: [
          { id: 'slide1', content: 'Slide 1 content' },
          { id: 'slide2', content: 'Slide 2 content' },
        ],
      };
  
      render(
        <Router>
          <PresentationCard presentation={presentationWithMultipleSlides} />
        </Router>
      );
  
      expect(screen.getByText(/2 Slides/i)).toBeInTheDocument();
    });
  });