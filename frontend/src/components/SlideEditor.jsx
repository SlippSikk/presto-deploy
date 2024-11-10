// src/components/SlideEditor.jsx

import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, Stack } from '@mui/material';
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

const SlideEditor = ({ presentationId, slide, updateSlide }) => {
  // State for adding new elements
  const [openTextModal, setOpenTextModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);

  // State for editing elements
  const [editingElement, setEditingElement] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // State for selected element
  const [selectedElementId, setSelectedElementId] = useState(null);

  const { deleteElement } = useContext(StoreContext);

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

  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleEditElement = (element) => {
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

  // Deselect element when clicking outside
  const handleContainerClick = () => {
    setSelectedElementId(null);
  };

  const renderHandles = (element) => {
    if (selectedElementId !== element.id) return null;

    const handleStyle = {
      position: 'absolute',
      width: '5px',
      height: '5px',
      backgroundColor: 'blue',
      border: '1px solid white',
      zIndex: 10,
      cursor: 'pointer',
    };

    const corners = [
      { corner: 'top-left', style: { top: '-3px', left: '-3px', cursor: 'nwse-resize' } },
      { corner: 'top-right', style: { top: '-3px', right: '-3px', cursor: 'nesw-resize' } },
      { corner: 'bottom-left', style: { bottom: '-3px', left: '-3px', cursor: 'nesw-resize' } },
      { corner: 'bottom-right', style: { bottom: '-3px', right: '-3px', cursor: 'nwse-resize' } },
    ];

    return (
      <>
        {corners.map(({ corner, style }) => (
          <Box
            key={corner}
            sx={{ ...handleStyle, ...style }}
            onMouseDown={(e) => e.stopPropagation()} // Prevent triggering parent events
            aria-label={`Resize handle ${corner}`}
          />
        ))}
        {/* Central Move Handle */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '5px',
            height: '5px',
            backgroundColor: 'green',
            border: '1px solid white',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            cursor: 'move',
          }}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Move handle"
        />
      </>
    );
  };

  const renderElement = (element) => {
    let content;
    switch (element.type) {
      case ELEMENT_TYPES.TEXT:
        content = (
          <TextBlock
            content={element.content}
            fontSize={element.fontSize}
            color={element.color}
          />
        );
        break;
      case ELEMENT_TYPES.IMAGE:
        content = <ImageBlock src={element.src} alt={element.alt} />;
        break;
      case ELEMENT_TYPES.VIDEO:
        content = <VideoBlock src={element.src} autoPlay={element.autoPlay} />;
        break;
      case ELEMENT_TYPES.CODE:
        content = (
          <CodeBlock
            code={element.code}
            language={element.language}
            fontSize={element.fontSize}
          />
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
          width: `${widthInPixels}px`,
          height: `${heightInPixels}px`,
        }}
        position={{
          x: xInPixels,
          y: yInPixels,
        }}
        onDragStart={() => setSelectedElementId(element.id)}
        onDragStop={(e, d) => {
          let newX = (d.x / containerSize.width) * 100;
          let newY = (d.y / containerSize.height) * 100;

          // Clamp within container
          newX = Math.max(0, Math.min(newX, 100 - element.size.width));
          newY = Math.max(0, Math.min(newY, 100 - element.size.height));

          const updatedElements = elements.map((el) =>
            el.id === element.id
              ? {
                  ...el,
                  position: {
                    x: newX,
                    y: newY,
                  },
                }
              : el
          );

          updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          let newWidth = (ref.offsetWidth / containerSize.width) * 100;
          let newHeight = (ref.offsetHeight / containerSize.height) * 100;
          let newX = (position.x / containerSize.width) * 100;
          let newY = (position.y / containerSize.height) * 100;

          // Enforce minimum size of 1%
          newWidth = Math.max(newWidth, 1);
          newHeight = Math.max(newHeight, 1);

          // Enforce boundaries
          if (newX + newWidth > 100) {
            newWidth = 100 - newX;
          }
          if (newY + newHeight > 100) {
            newHeight = 100 - newY;
          }

          const updatedElements = elements.map((el) =>
            el.id === element.id
              ? {
                  ...el,
                  size: {
                    width: newWidth,
                    height: newHeight,
                  },
                  position: {
                    x: newX,
                    y: newY,
                  },
                }
              : el
          );

          updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
        }}
        bounds="parent"
        enableResizing={selectedElementId === element.id}
        disableDragging={selectedElementId !== element.id}
        dragHandleClassName="move-handle"
        style={{
          zIndex: element.layer,
        }}
        minWidth={(1 / 100) * containerSize.width}
        minHeight={(1 / 100) * containerSize.height}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border:
              element.type === ELEMENT_TYPES.TEXT
                ? '1px solid grey'
                : element.type === ELEMENT_TYPES.VIDEO
                ? '3px solid grey'
                : 'none',
            backgroundColor:
              element.type === ELEMENT_TYPES.TEXT
                ? 'white'
                : element.type === ELEMENT_TYPES.VIDEO
                ? 'grey'
                : 'transparent',
            padding: '5px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onDoubleClick={() => handleEditElement(element)}
          onContextMenu={(e) => {
            e.preventDefault();
            deleteElement(presentationId, slide.id, element.id);
          }}
          onClick={(e) => handleElementClick(e, element)}
          aria-label={`${element.type} element`}
          tabIndex={0}
        >
          {content}
          {renderHandles(element)}
        </Box>
      </Rnd>
    );
  };

  return (
    <Box onClick={handleContainerClick}>
      {/* Controls to Add Elements */}
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
    elements: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  updateSlide: PropTypes.func.isRequired,
};

export default SlideEditor;
