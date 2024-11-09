// src/components/SlideEditor.jsx

import React, { useContext, useState, useEffect } from 'react';
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

  const { deleteElement } = useContext(StoreContext);

  // Debugging: Log the slide prop
  useEffect(() => {
    console.log('Slide prop:', slide);
  }, [slide]);

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

  const handleAddElement = (type, elementData) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      position: { x: 50, y: 50 }, // Center position
      size: { width: 30, height: 10 },
      layer: elements.length + 1,
      ...elementData,
    };
    const updatedElements = [...elements, newElement];
    updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
  };

  const handleElementDragStop = (e, d, element) => {
    const updatedElements = elements.map((el) =>
      el.id === element.id
        ? { ...el, position: { x: (d.x / 800) * 100, y: (d.y / 600) * 100 } }
        : el
    );
    updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
  };

  const handleElementResizeStop = (e, direction, ref, delta, position, element) => {
    const updatedElements = elements.map((el) =>
      el.id === element.id
        ? {
            ...el,
            size: { width: (ref.offsetWidth / 800) * 100, height: (ref.offsetHeight / 600) * 100 },
            position: { x: (position.x / 800) * 100, y: (position.y / 600) * 100 },
          }
        : el
    );
    updateSlide(presentationId, slide.id, { ...slide, elements: updatedElements });
  };

  const renderElement = (element) => {
    const style = {
      position: 'absolute',
      border: '1px solid grey',
      backgroundColor: 'white', // Ensure element background is white
      padding: '5px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'move', // Indicate draggable
    };

    let content;
    switch (element.type) {
      case ELEMENT_TYPES.TEXT:
        content = <TextBlock content={element.content} fontSize={element.fontSize} color={element.color} />;
        break;
      case ELEMENT_TYPES.IMAGE:
        content = <ImageBlock src={element.src} alt={element.alt} />;
        break;
      case ELEMENT_TYPES.VIDEO:
        content = <VideoBlock src={element.src} autoPlay={element.autoPlay} />;
        break;
      case ELEMENT_TYPES.CODE:
        content = <CodeBlock code={element.code} language={element.language} fontSize={element.fontSize} />;
        break;
      default:
        return null;
    }

    return (
      <Rnd
        key={element.id}
        size={{
          width: `${element.size.width}%`,
          height: `${element.size.height}%`,
        }}
        position={{
          x: (element.position.x / 100) * 800, // Assuming slide width is 800px
          y: (element.position.y / 100) * 600, // Assuming slide height is 600px
        }}
        bounds="parent"
        onDragStop={(e, d) => handleElementDragStop(e, d, element)}
        onResizeStop={(e, direction, ref, delta, position) =>
          handleElementResizeStop(e, direction, ref, delta, position, element)
        }
        style={{ zIndex: element.layer }}
        enableResizing={{
          bottom: true,
          bottomLeft: true,
          bottomRight: true,
          left: true,
          right: true,
          top: true,
          topLeft: true,
          topRight: true,
        }}
      >
        <Box
          sx={style}
          onDoubleClick={() => handleEditElement(element)}
          onContextMenu={(e) => {
            e.preventDefault();
            deleteElement(presentationId, slide.id, element.id);
          }}
          aria-label={`${element.type} element`}
          tabIndex={0} // Make focusable
        >
          {content}
        </Box>
      </Rnd>
    );
  };

  const handleEditElement = (element) => {
    setEditingElement(element);
    setOpenEditModal(true);
  };

  const handleUpdateElement = (updatedElement) => {
    updateSlide(presentationId, slide.id, {
      ...slide,
      elements: slide.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
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

  return (
    <Box>
      {/* Controls to Add Elements */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <IconButton color="primary" onClick={() => setOpenTextModal(true)} aria-label="Add Text">
          <Add />
          <Typography variant="caption">Text</Typography>
        </IconButton>
        <IconButton color="primary" onClick={() => setOpenImageModal(true)} aria-label="Add Image">
          <Add />
          <Typography variant="caption">Image</Typography>
        </IconButton>
        <IconButton color="primary" onClick={() => setOpenVideoModal(true)} aria-label="Add Video">
          <Add />
          <Typography variant="caption">Video</Typography>
        </IconButton>
        <IconButton color="primary" onClick={() => setOpenCodeModal(true)} aria-label="Add Code">
          <Add />
          <Typography variant="caption">Code</Typography>
        </IconButton>
      </Stack>

      {/* Slide Container */}
      <Box
        sx={{
          position: 'relative',
          width: '800px',
          height: '600px',
          border: '1px solid #ccc',
          margin: '0 auto',
          backgroundColor: '#ffffff', // Set slide background to white
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
      <AddTextModal open={openTextModal} onClose={() => setOpenTextModal(false)} onAdd={handleAddElement} />
      <AddImageModal open={openImageModal} onClose={() => setOpenImageModal(false)} onAdd={handleAddElement} />
      <AddVideoModal open={openVideoModal} onClose={() => setOpenVideoModal(false)} onAdd={handleAddElement} />
      <AddCodeModal open={openCodeModal} onClose={() => setOpenCodeModal(false)} onAdd={handleAddElement} />

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
