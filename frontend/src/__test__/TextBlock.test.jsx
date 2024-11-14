// src/components/elements/TextBlock.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import TextBlock from '../components/elements/TextBlock';
import { describe, it, expect } from 'vitest';

describe('TextBlock Component', () => {
  it('renders the correct content', () => {
    render(<TextBlock content="Hello, World!" fontSize={1.5} color="#ff0000" />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('applies the correct font size', () => {
    render(<TextBlock content="Sample Text" fontSize={2} color="#000000" />);
    const textElement = screen.getByText('Sample Text');
    expect(textElement).toHaveStyle('font-size: 2em');
  });

  it('applies the correct color', () => {
    render(<TextBlock content="Colored Text" fontSize={1} color="#00ff00" />);
    const textElement = screen.getByText('Colored Text');
    expect(textElement).toHaveStyle('color: #00ff00');
  });

  it('handles empty content gracefully', () => {
    render(<TextBlock content="" fontSize={1} color="#000000" />);
    const textElement = screen.getByText('', { selector: 'p' });
    expect(textElement).toBeInTheDocument();
  });

  it('escapes HTML content to prevent XSS', () => {
    const maliciousContent = '<img src=x onerror=alert(1)//>';
    render(<TextBlock content={maliciousContent} fontSize={1} color="#000000" />);
    // Ensure the text content matches the escaped HTML
    const textElement = screen.getByText(/<img src=x onerror=alert\(1\)\/\//i);
    expect(textElement).toBeInTheDocument();
    // Ensure the content is properly escaped
    expect(textElement.innerHTML).toBe('&lt;img src=x onerror=alert(1)//&gt;');
  });
});
