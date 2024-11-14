import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PresentationCard from '../components/PresentationCard';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

import { describe, it, expect, vi } from 'vitest';

describe('PresentationCard Component', () => {
  const mockPresentation = {
    id: '123',
    name: 'Test Presentation',
    thumbnail: 'https://via.placeholder.com/150',
    description: 'This is a mock presentation.',
    slides: [{ id: 'slide1', content: 'Slide 1 content' }],
    favorited: false,
  };

  const mockUpdatePresentation = vi.fn();

  const renderWithContext = (component) => {
    return render(
      <StoreContext.Provider value={{ updatePresentation: mockUpdatePresentation }}>
        <Router>{component}</Router>
      </StoreContext.Provider>
    );
  };

  it('renders presentation name, description, and slide count', () => {
    renderWithContext(<PresentationCard presentation={mockPresentation} />);

    const nameElements = screen.getAllByText(/Test Presentation/i);
    expect(nameElements).toHaveLength(1);
    expect(nameElements[0]).toBeInTheDocument();

    expect(screen.getByText(/This is a mock presentation./i)).toBeInTheDocument();
    expect(screen.getByText(/1 Slide/i)).toBeInTheDocument();
  });

  it('renders thumbnail image when available', () => {
    renderWithContext(<PresentationCard presentation={mockPresentation} />);

    const imgElement = screen.getByAltText(/Test Presentation Thumbnail/i);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', mockPresentation.thumbnail);
  });

  it('renders default thumbnail when no thumbnail is provided', () => {
    const presentationWithoutThumbnail = { ...mockPresentation, thumbnail: null };
    renderWithContext(<PresentationCard presentation={presentationWithoutThumbnail} />);

    expect(screen.getByText(/No Thumbnail/i)).toBeInTheDocument();
  });

  it('opens presentation link correctly', () => {
    renderWithContext(<PresentationCard presentation={mockPresentation} />);

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

    renderWithContext(<PresentationCard presentation={presentationWithMultipleSlides} />);

    expect(screen.getByText(/2 Slides/i)).toBeInTheDocument();
  });

  it('calls updatePresentation on favorite toggle', async () => {
    renderWithContext(<PresentationCard presentation={mockPresentation} />);

    const favoriteButton = screen.getByRole('button', { name: /Favorite presentation/i });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(mockUpdatePresentation).toHaveBeenCalledWith(mockPresentation.id, {
        ...mockPresentation,
        favorited: true,
      });
    });
  });
});
