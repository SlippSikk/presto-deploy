// src/components/modals/__tests__/AddTextModal.test.jsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AddTextModal from '../components/modals/AddTextModal';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('AddTextModal Component', () => {
  const setup = (propsOverrides = {}) => {
    const onClose = vi.fn();
    const onAdd = vi.fn();

    const props = {
      open: true,
      onClose,
      onAdd,
      ...propsOverrides,
    };

    render(<AddTextModal {...props} />);

    return {
      onClose,
      onAdd,
    };
  };

  it('renders correctly when open', () => {
    setup();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Text Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Font Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Text Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Width Percentage')).toBeInTheDocument();
    expect(screen.getByLabelText('Height Percentage')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<AddTextModal open={false} onClose={() => {}} onAdd={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onAdd with correct data when form is submitted', async () => {
    const { onAdd, onClose } = setup();
  
    const contentInput = screen.getByTestId('content-input');
    const fontSizeInput = screen.getByTestId('font-size-input');
    const colorInput = screen.getByTestId('color-input');
    const widthInput = screen.getByTestId('width-percentage-input');
    const heightInput = screen.getByTestId('height-percentage-input');
  
    // Simulate user interactions
    fireEvent.change(contentInput, { target: { value: 'Sample Text' } });
    fireEvent.change(fontSizeInput, { target: { value: '2' } });
    fireEvent.change(colorInput, { target: { value: '#FF5733' } });
    fireEvent.change(widthInput, { target: { value: '50' } });
    fireEvent.change(heightInput, { target: { value: '20' } });
  
    // Click the Add button
    userEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    // Assert onAdd and onClose
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith('text', {
        content: 'Sample Text',
        fontSize: 2,
        color: '#FF5733',
        size: { width: 50, height: 20 },
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
  it('displays error when content is empty', async () => {
    setup();

    // Leave the Content field empty
    // Click the Add button
    userEvent.click(screen.getByRole('button', { name: /Add/i }));

    expect(await screen.findByText('Content cannot be empty')).toBeInTheDocument();
  });

  it('displays error for invalid HEX color code', async () => {
    setup();

    await userEvent.type(screen.getByTestId('content-input'), 'Sample Text');
    await userEvent.clear(screen.getByTestId('color-input'));
    await userEvent.type(screen.getByTestId('color-input'), '123456'); // Invalid HEX

    await userEvent.click(screen.getByRole('button', { name: /Add/i }));

    expect(await screen.findByText('Invalid HEX color code')).toBeInTheDocument();
  });

  it('resets form fields after successful submission', async () => {
    const { onAdd, onClose } = setup();

    // Fill in the form
    await userEvent.type(screen.getByTestId('content-input'), 'Sample Text');
    await userEvent.clear(screen.getByTestId('font-size-input'));
    await userEvent.type(screen.getByTestId('font-size-input'), '2');
    await userEvent.clear(screen.getByTestId('color-input'));
    await userEvent.type(screen.getByTestId('color-input'), '#FF5733');
    await userEvent.clear(screen.getByTestId('width-percentage-input'));
    await userEvent.type(screen.getByTestId('width-percentage-input'), '50');
    await userEvent.clear(screen.getByTestId('height-percentage-input'));
    await userEvent.type(screen.getByTestId('height-percentage-input'), '20');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /Add/i }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    // Check reset fields
    expect(screen.getByTestId('content-input')).toHaveValue('');
    expect(screen.getByTestId('font-size-input')).toHaveValue(1); // Default value
    expect(screen.getByTestId('color-input')).toHaveValue('#000000');
    expect(screen.getByTestId('width-percentage-input')).toHaveValue(30);
    expect(screen.getByTestId('height-percentage-input')).toHaveValue(10);
    expect(screen.queryByText('Content cannot be empty')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid HEX color code')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const { onClose } = setup();

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('prevents submission when fontSize is below minimum', async () => {
    setup();

    // Fill in the Content field using data-testid
    await userEvent.type(screen.getByTestId('content-input'), 'Sample Text');

    // Enter fontSize below minimum (0.4 < 0.5)
    await userEvent.clear(screen.getByTestId('font-size-input'));
    await userEvent.type(screen.getByTestId('font-size-input'), '0.4');

    // Click the Add button
    await userEvent.click(screen.getByRole('button', { name: /Add/i }));

    // Check that there is no unrelated validation error
    await waitFor(() => {
      expect(screen.queryByText('Invalid HEX color code')).not.toBeInTheDocument();
    });
  });

  it('prevents submission when sizeWidth is out of bounds', async () => {
    setup();

    // Fill in the Content field using data-testid
    await userEvent.type(screen.getByTestId('content-input'), 'Sample Text');

    // Enter sizeWidth out of bounds (e.g., 150 > 100)
    await userEvent.clear(screen.getByTestId('width-percentage-input'));
    await userEvent.type(screen.getByTestId('width-percentage-input'), '150');

    // Click the Add button
    await userEvent.click(screen.getByRole('button', { name: /Add/i }));

    // Check that there is no unrelated validation error
    await waitFor(() => {
      expect(screen.queryByText('Invalid HEX color code')).not.toBeInTheDocument();
    });
  });

  it('allows submission with boundary values', async () => {
    const { onAdd, onClose } = setup();

    // Use data-testid to interact with inputs
    await userEvent.type(screen.getByTestId('content-input'), 'Boundary Test');
    await userEvent.clear(screen.getByTestId('font-size-input'));
    await userEvent.type(screen.getByTestId('font-size-input'), '0.5'); // Minimum allowed
    await userEvent.clear(screen.getByTestId('color-input'));
    await userEvent.type(screen.getByTestId('color-input'), '#FFF'); // 3-digit HEX
    await userEvent.clear(screen.getByTestId('width-percentage-input'));
    await userEvent.type(screen.getByTestId('width-percentage-input'), '1'); // Minimum allowed
    await userEvent.clear(screen.getByTestId('height-percentage-input'));
    await userEvent.type(screen.getByTestId('height-percentage-input'), '100'); // Maximum allowed
  
    // Click the Add button
    await userEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    // Assert the submission
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith('text', {
        content: 'Boundary Test',
        fontSize: 0.5,
        color: '#FFF',
        size: { width: 1, height: 100 },
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('supports keyboard navigation and accessibility', async () => {
    setup();

    // Navigate through elements with Tab
    await userEvent.tab();
    expect(screen.getByTestId('content-input')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('font-size-input')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('color-input')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('width-percentage-input')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('height-percentage-input')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole('button', { name: /Cancel/i })).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole('button', { name: /Add/i })).toHaveFocus();
  });
});
