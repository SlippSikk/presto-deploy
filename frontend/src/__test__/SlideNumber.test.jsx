// src/components/SlideNumber.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import SlideNumber from '../components/SlideNumber';
import { describe, it, expect } from 'vitest';

describe('SlideNumber Component', () => {
  it('displays the correct slide number', () => {
    render(<SlideNumber current={2} total={5} />);
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('renders with correct aria-label', () => {
    render(<SlideNumber current={1} total={3} />);
    const slideNumber = screen.getByLabelText(/slide number/i);
    expect(slideNumber).toBeInTheDocument();
    expect(slideNumber).toHaveTextContent('1/3');
  });

  it('handles single slide correctly', () => {
    render(<SlideNumber current={1} total={1} />);
    expect(screen.getByText('1/1')).toBeInTheDocument();
  });

  it('updates when props change', () => {
    const { rerender } = render(<SlideNumber current={1} total={3} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();

    rerender(<SlideNumber current={2} total={3} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();

    rerender(<SlideNumber current={3} total={3} />);
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('updates correctly when a slide is deleted', () => {
    const { rerender } = render(<SlideNumber current={2} total={5} />);
    expect(screen.getByText('2/5')).toBeInTheDocument();

    // Simulate deleting a slide, reducing total slides from 5 to 4
    rerender(<SlideNumber current={2} total={4} />);
    expect(screen.getByText('2/4')).toBeInTheDocument();
  });
});
