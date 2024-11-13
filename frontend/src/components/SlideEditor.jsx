// src/components/SlideEditor.jsx

import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';
import { ELEMENT_TYPES } from '../types/elementTypes';
import TextBlock from './elements/TextBlock';
import ImageBlock from './elements/ImageBlock';
import VideoBlock from './elements/VideoBlock';
import CodeBlock from './elements/CodeBlock';
import { Rnd } from 'react-rnd';
import AddTextModal from './modals/AddTextModal';
import AddImageModal from './modals/AddImageModal';
import AddVideoModal from './modals/AddVideoModal';
import AddCodeModal from './modals/AddCodeModal';
import EditTextModal from './modals/EditTextModal';
import EditImageModal from './modals/EditImageModal';
import EditVideoModal from './modals/EditVideoModal';
import EditCodeModal from './modals/EditCodeModal';

// Define available font families
const FONT_FAMILIES = ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];

const SlideEditor = ({ presentationId, slide, updateSlide }) => {
  // State for adding new elements
  const [openTextModal, setOpenTextModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);

  // State for editing elements
  const [editingElement, setEditingElement] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // State for selected element (for showing resize/move handles)
  const [selectedElementId, setSelectedElementId] = useState(null);

  // **New State for Font Selection**
  const [selectedFont, setSelectedFont] = useState(slide.fontFamily || 'Arial');

  const { deleteElement } = useContext(StoreContext);

  // Debugging: Log the slide prop
  useEffect(() => {
    console.log('Slide prop:', slide);
  }, [slide]);

  // **Effect to update selectedFont when slide changes**
  useEffect(() => {
    setSelectedFont(slide.fontFamily || 'Arial');
  }, [slide]);

  // Handler for font change
  const handleFontChange = (e) => {
    const newFont = e.target.value;
    setSelectedFont(newFont);
    updateSlide(presentationId, slide.id, { ...slide, fontFamily: newFont });
  };

  // Defensive check: Ensure slide is defined
  if (!slide) {
    return (
      <Box>
        <Typography variant="h6">Slide data is unavailable.</Typography>
      </Box>
    );
  }

  // Ensure elements is an array
  const elements = Array.isArray(slide.elements) ? slide.elements : [];

  // Ref and state to track container size
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    // Initial size update
    updateSize();

    // Update size on window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleAddElement = (type, elementData) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      position: { x: 0, y: 0 }, // Top-left corner
      size: { width: 30, height: 10 }, // Default size in percentages
      layer: elements.length + 1,
      ...elementData,
    };
    const updatedElements = [...elements, newElement];
    updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
  };

  const handleUpdateElementPositionAndSize = (id, position, size) => {
    const updatedElements = elements.map((el) =>
      el.id === id
        ? {
            ...el,
            position, // { x: percentage, y: percentage }
            size, // { width: percentage, height: percentage }
          }
        : el
    );
    updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
  };

  const handleElementDoubleClick = (element) => {
    setEditingElement(element);
    setOpenEditModal(true);
  };

  const handleUpdateElement = (updatedElement) => {
    updateSlide(presentationId, slide.id, {
      ...slide,
      elements: slide.elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      ),
    });
    setOpenEditModal(false);
    setEditingElement(null);
  };

  const getEditModal = () => {
    if (!editingElement) return null;

    switch (editingElement.type) {
      case ELEMENT_TYPES.TEXT:
        return (
          <EditTextModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            element={editingElement}
            onUpdate={handleUpdateElement}
          />
        );
      case ELEMENT_TYPES.IMAGE:
        return (
          <EditImageModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            element={editingElement}
            onUpdate={handleUpdateElement}
          />
        );
      case ELEMENT_TYPES.VIDEO:
        return (
          <EditVideoModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            element={editingElement}
            onUpdate={handleUpdateElement}
          />
        );
      case ELEMENT_TYPES.CODE:
        return (
          <EditCodeModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            element={editingElement}
            onUpdate={handleUpdateElement}
          />
        );
      default:
        return null;
    }
  };

  const renderElement = (element) => {
    let content;
    switch (element.type) {
      case ELEMENT_TYPES.TEXT:
        content = (
          <Box
            sx={{
              border: '1px solid lightgrey', // Soft grey border for text
              padding: '5px',
              backgroundColor: 'white',
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <TextBlock
              content={element.content}
              fontSize={element.fontSize}
              color={element.color}
              fontFamily={slide.fontFamily || 'Arial'} // **Pass fontFamily to TextBlock**
            />
          </Box>
        );
        break;

      case ELEMENT_TYPES.IMAGE:
        content = <ImageBlock src={element.src} alt={element.alt} />;
        break;

      case ELEMENT_TYPES.VIDEO:
        content = (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {selectedElementId === element.id && (
              <Box
                sx={{
                  position: 'absolute',
                  width: 'calc(100% + 10px)',
                  height: 'calc(100% + 10px)',
                  top: '-5px',
                  left: '-5px',
                  zIndex: 1,
                }}
              />
            )}
            <VideoBlock src={element.src} autoPlay={element.autoPlay} />
          </Box>
        );
        break;

      case ELEMENT_TYPES.CODE:
        content = (
          <Box
            sx={{
              border: '1px solid lightgrey',
              padding: '10px',
              backgroundColor: '#f5f5f5', // Light grey background for code blocks
              fontFamily: 'monospace', // Use monospace font for code
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <CodeBlock code={element.code} language={element.language} />
          </Box>
        );
        break;
      default:
        return null;
    }

    // Convert percentage sizes to pixels
    const widthInPixels = (element.size.width / 100) * containerSize.width;
    const heightInPixels = (element.size.height / 100) * containerSize.height;

    // Convert percentage positions to pixels
    const xInPixels = (element.position.x / 100) * containerSize.width;
    const yInPixels = (element.position.y / 100) * containerSize.height;

    return (
      <Rnd
        key={element.id}
        size={{
          width: widthInPixels,
          height: heightInPixels,
        }}
        position={{
          x: xInPixels,
          y: yInPixels,
        }}
        onDragStop={(e, d) => {
          // Calculate new position in percentage
          const newX = (d.x / containerSize.width) * 100;
          const newY = (d.y / containerSize.height) * 100;
          handleUpdateElementPositionAndSize(element.id, { x: newX, y: newY }, element.size);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          // Calculate new size and position in percentage
          const newWidth = (ref.offsetWidth / containerSize.width) * 100;
          const newHeight = (ref.offsetHeight / containerSize.height) * 100;
          const newX = (position.x / containerSize.width) * 100;
          const newY = (position.y / containerSize.height) * 100;

          // Enforce minimum size of 1%
          const finalWidth = Math.max(newWidth, 1);
          const finalHeight = Math.max(newHeight, 1);

          // Enforce boundaries
          const maxWidth = 100 - newX;
          const maxHeight = 100 - newY;
          const finalWidthClamped = Math.min(finalWidth, maxWidth);
          const finalHeightClamped = Math.min(finalHeight, maxHeight);

          handleUpdateElementPositionAndSize(
            element.id,
            { x: newX, y: newY },
            { width: finalWidthClamped, height: finalHeightClamped }
          );
        }}
        bounds="parent"
        minWidth={(1 / 100) * containerSize.width} // 1% of container width
        minHeight={(1 / 100) * containerSize.height} // 1% of container height
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: selectedElementId === element.id,
          bottomRight: selectedElementId === element.id,
          bottomLeft: selectedElementId === element.id,
          topLeft: selectedElementId === element.id,
        }}
        disableDragging={selectedElementId !== element.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElementId(element.id);
        }}
        style={{
          zIndex: element.layer,
          border: selectedElementId === element.id ? '1px solid blue' : 'none', // Blue border for selected element
          padding: '5px',
          boxSizing: 'border-box',
          cursor: selectedElementId === element.id ? 'move' : 'pointer',
        }}
        onDoubleClick={() => handleElementDoubleClick(element)}
        onContextMenu={(e) => {
          e.preventDefault();
          deleteElement(presentationId, slide.id, element.id);
        }}
        aria-label={`${element.type} element`}
      >
        {content}

        {/* Render custom handles only for the selected element */}
        {selectedElementId === element.id && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              pointerEvents: 'none', // Allow clicks to pass through
            }}
          >
            {/* Resize Handles */}
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                backgroundColor: 'blue',
                top: '-2.5px',
                left: '-3px',
                cursor: 'nwse-resize',
                zIndex: 10,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                backgroundColor: 'blue',
                top: '-2.5px',
                right: '-2.5px',
                cursor: 'nesw-resize',
                zIndex: 10,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                backgroundColor: 'blue',
                bottom: '-2.5px',
                left: '-3px',
                cursor: 'nesw-resize',
                zIndex: 10,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                backgroundColor: 'blue',
                bottom: '-2.5px',
                right: '-2.5px',
                cursor: 'nwse-resize',
                zIndex: 10,
              }}
            />
          </Box>
        )}
      </Rnd>
    );
  };

  // Deselect element when clicking outside
  const handleContainerClick = () => {
    setSelectedElementId(null);
  };

  return (
    <Box onClick={handleContainerClick} sx={{ userSelect: 'none' }}>
      {/* **Updated: Controls to Add Elements + Font Dropdown** */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <IconButton
          color="primary"
          onClick={() => setOpenTextModal(true)}
          aria-label="Add Text"
        >
          <Add />
          <Typography variant="caption">Text</Typography>
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => setOpenImageModal(true)}
          aria-label="Add Image"
        >
          <Add />
          <Typography variant="caption">Image</Typography>
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => setOpenVideoModal(true)}
          aria-label="Add Video"
        >
          <Add />
          <Typography variant="caption">Video</Typography>
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => setOpenCodeModal(true)}
          aria-label="Add Code"
        >
          <Add />
          <Typography variant="caption">Code</Typography>
        </IconButton>

        {/* **New: Font Family Dropdown** */}
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="font-family-select-label">Font</InputLabel>
          <Select
            labelId="font-family-select-label"
            id="font-family-select"
            value={selectedFont}
            label="Font"
            onChange={handleFontChange}
            aria-label="Font Family Selector"
          >
            {FONT_FAMILIES.map((font) => (
              <MenuItem key={font} value={font}>
                <Typography style={{ fontFamily: font }}>{font}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Slide Container */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          height: '60vh',
          border: '1px solid #ccc',
          margin: '0 auto',
          backgroundColor: '#ffffff', // Set slide background to white
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // Ensure elements outside are clipped
          boxSizing: 'border-box', // Ensure border is included in size calculations
        }}
        aria-label="Slide Editor"
      >
        {elements.length > 0 ? (
          elements.map((element) => renderElement(element))
        ) : (
          <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
            No elements in this slide.
          </Typography>
        )}
      </Box>

      {/* Add Element Modals */}
      <AddTextModal
        open={openTextModal}
        onClose={() => setOpenTextModal(false)}
        onAdd={handleAddElement}
      />
      <AddImageModal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        onAdd={handleAddElement}
      />
      <AddVideoModal
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        onAdd={handleAddElement}
      />
      <AddCodeModal
        open={openCodeModal}
        onClose={() => setOpenCodeModal(false)}
        onAdd={handleAddElement}
      />

      {/* Edit Element Modal */}
      {getEditModal()}
    </Box>
  );
};

SlideEditor.propTypes = {
  presentationId: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    id: PropTypes.string.isRequired,
    elements: PropTypes.arrayOf(PropTypes.object).isRequired,
    fontFamily: PropTypes.string,
  }).isRequired,
  updateSlide: PropTypes.func.isRequired,
};

export default SlideEditor;
