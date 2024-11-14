// src/components/__tests__/SlideControls.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SlideControls from '../components/SlideControls';
import { describe, it, expect, vi } from 'vitest';

describe('SlideControls Component', () => {
  const mockOnPrevious = vi.fn();
  const mockOnNext = vi.fn();

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('does not render arrows when there is only one slide', () => {
    render(<SlideControls currentSlideIndex={0} totalSlides={1} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    expect(screen.queryByLabelText(/Previous Slide/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Next Slide/i)).not.toBeInTheDocument();
  });

  it('renders both arrows when multiple slides are present', () => {
    render(<SlideControls currentSlideIndex={1} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    expect(screen.getByLabelText(/Previous Slide/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Next Slide/i)).toBeInTheDocument();
  });

  it('disables Previous arrow on first slide', () => {
    render(<SlideControls currentSlideIndex={0} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    const prevButton = screen.getByLabelText(/Previous Slide/i);
    expect(prevButton).toBeDisabled();
    const nextButton = screen.getByLabelText(/Next Slide/i);
    expect(nextButton).toBeEnabled();
  });

  it('disables Next arrow on last slide', () => {
    render(<SlideControls currentSlideIndex={2} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    const nextButton = screen.getByLabelText(/Next Slide/i);
    expect(nextButton).toBeDisabled();
    const prevButton = screen.getByLabelText(/Previous Slide/i);
    expect(prevButton).toBeEnabled();
  });

  it('calls onPrevious when Previous arrow is clicked', () => {
    render(<SlideControls currentSlideIndex={1} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    const prevButton = screen.getByLabelText(/Previous Slide/i);
    fireEvent.click(prevButton);
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when Next arrow is clicked', () => {
    render(<SlideControls currentSlideIndex={1} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    const nextButton = screen.getByLabelText(/Next Slide/i);
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard arrow keys for navigation', () => {
    render(<SlideControls currentSlideIndex={1} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);

    fireEvent.keyDown(window, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('does not call onPrevious when on first slide and ArrowLeft is pressed', () => {
    render(<SlideControls currentSlideIndex={0} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    fireEvent.keyDown(window, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(mockOnPrevious).not.toHaveBeenCalled();
  });

  it('does not call onNext when on last slide and ArrowRight is pressed', () => {
    render(<SlideControls currentSlideIndex={2} totalSlides={3} onPrevious={mockOnPrevious} onNext={mockOnNext} />);
    fireEvent.keyDown(window, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(mockOnNext).not.toHaveBeenCalled();
  });
});
