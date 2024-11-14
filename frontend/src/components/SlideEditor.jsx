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
import { Add, Brush, PlayArrow } from '@mui/icons-material';
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
import BackgroundPickerModal from './modals/BackgroundPickerModal';
import DefaultBackgroundPickerModal from './modals/DefaultBackgroundPickerModal';

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

  // State for Font Selection
  const [selectedFont, setSelectedFont] = useState(slide.fontFamily || 'Arial');

  // States for Background Pickers
  const [openBackgroundModal, setOpenBackgroundModal] = useState(false);
  const [openDefaultBackgroundModal, setOpenDefaultBackgroundModal] = useState(false); // State for default background modal

  // Destructure required functions from StoreContext
  const { deleteElement, updateDefaultBackground } = useContext(StoreContext);

  // Debugging: Log the slide prop
  useEffect(() => {
    console.log('Slide prop:', slide);
  }, [slide]);

  // Effect to synchronize font when slide changes
  useEffect(() => {
    setSelectedFont(slide.fontFamily || 'Arial');
  }, [slide]);

  // Handler for font change
  const handleFontChange = (e) => {
    const newFont = e.target.value;
    if (newFont === slide.fontFamily) return; // No change needed
    setSelectedFont(newFont);
    const updatedSlide = { ...slide, fontFamily: newFont };
    updateSlide(presentationId, slide.id, updatedSlide);
  };

  // Handler for background update (current slide)
  const handleBackgroundUpdate = (newBackground) => {
    // Compare newBackground with current slide.background to prevent unnecessary updates
    const isDifferent = JSON.stringify(newBackground) !== JSON.stringify(slide.background);
    if (!isDifferent) return; // No change needed
    const updatedSlide = { ...slide, background: newBackground };
    updateSlide(presentationId, slide.id, updatedSlide);
  };

  // Handler for default background update
  const handleDefaultBackgroundUpdate = (newBackground) => {
    updateDefaultBackground(presentationId, newBackground);
  };

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
    const updatedSlide = { ...slide, elements: updatedElements };
    updateSlide(presentationId, slide.id, updatedSlide);
  };

  // Updated openPreview Function Using window.open
  const openPreview = () => {
    window.open(`/presentation/${presentationId}/preview`, '_blank');
  };

  const handleUpdateElementPositionAndSize = (id, position, size) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    // Check if position and size have actually changed
    const isPositionChanged = element.position.x !== position.x || element.position.y !== position.y;
    const isSizeChanged = element.size.width !== size.width || element.size.height !== size.height;
    if (!isPositionChanged && !isSizeChanged) return; // No change needed

    const updatedElements = elements.map((el) =>
      el.id === id
        ? {
            ...el,
            position, // { x: percentage, y: percentage }
            size, // { width: percentage, height: percentage }
          }
        : el
    );
    const updatedSlide = { ...slide, elements: updatedElements };
    updateSlide(presentationId, slide.id, updatedSlide);
  };

  const handleElementDoubleClick = (element) => {
    setEditingElement(element);
    setOpenEditModal(true);
  };

  const handleUpdateElement = (updatedElement) => {
    const updatedElements = elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    const updatedSlide = { ...slide, elements: updatedElements };
    updateSlide(presentationId, slide.id, updatedSlide);
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
              fontFamily={slide.fontFamily || 'Arial'} // Apply selected font to text blocks
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
      {/* Controls: Default Background Button, Element Addition Buttons, Font Dropdown, Current Slide Background, Preview */}
      <Stack direction="column" spacing={2} sx={{ mb: 2 }} alignItems="flex-start">
        {/* Default Background Button */}
        <IconButton
          color="secondary"
          onClick={() => setOpenDefaultBackgroundModal(true)}
          aria-label="Set Default Background"
        >
          <Brush />
          <Typography variant="caption">Default Background</Typography>
        </IconButton>

        {/* Element Addition Buttons, Font Dropdown, Current Slide Background Picker, and Preview Button */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }} // Stack vertically on extra-small screens, horizontally on small and above
          spacing={2}
          alignItems="center"
          sx={{ width: '100%' }}
          justifyContent="space-between" // Pushes the Preview button to the right
          flexWrap="wrap" // Allows wrapping on smaller screens
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            {/* Add Text Button */}
            <IconButton
              color="primary"
              onClick={() => setOpenTextModal(true)}
              aria-label="Add Text"
            >
              <Add />
              <Typography variant="caption">Text</Typography>
            </IconButton>
            {/* Add Image Button */}
            <IconButton
              color="primary"
              onClick={() => setOpenImageModal(true)}
              aria-label="Add Image"
            >
              <Add />
              <Typography variant="caption">Image</Typography>
            </IconButton>
            {/* Add Video Button */}
            <IconButton
              color="primary"
              onClick={() => setOpenVideoModal(true)}
              aria-label="Add Video"
            >
              <Add />
              <Typography variant="caption">Video</Typography>
            </IconButton>
            {/* Add Code Button */}
            <IconButton
              color="primary"
              onClick={() => setOpenCodeModal(true)}
              aria-label="Add Code"
            >
              <Add />
              <Typography variant="caption">Code</Typography>
            </IconButton>

            {/* Font Family Dropdown */}
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

            {/* Current Slide Background Picker Button */}
            <IconButton
              color="secondary"
              onClick={() => setOpenBackgroundModal(true)}
              aria-label="Set Current Slide Background"
            >
              <Brush />
              <Typography variant="caption">Current Slide Background</Typography>
            </IconButton>
          </Stack>

          {/* Preview Presentation Button */}
          <IconButton
            color="primary"
            onClick={openPreview}
            aria-label="Preview Presentation"
            size="large"
            sx={{ marginTop: { xs: 1, sm: 0 } }} // Adds top margin on extra-small screens
          >
            <PlayArrow fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Slide Container with Dynamic Background */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          height: '60vh',
          border: '1px solid #ccc',
          margin: '0 auto',
          backgroundColor:
            slide.background?.style === 'solid' ? slide.background.color : '#ffffff', // Default to white if not solid
          backgroundImage:
            slide.background?.style === 'gradient'
              ? `linear-gradient(${slide.background.gradient.direction}, ${slide.background.gradient.colors.join(
                  ', '
                )})`
              : slide.background?.style === 'image'
              ? `url(${slide.background.image})`
              : 'none',
          backgroundSize: slide.background?.style === 'image' ? 'cover' : 'auto',
          backgroundRepeat: slide.background?.style === 'image' ? 'no-repeat' : 'repeat',
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
        onAdd={(type, data) => handleAddElement(type, data)}
      />
      <AddImageModal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        onAdd={(type, data) => handleAddElement(type, data)}
      />
      <AddVideoModal
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        onAdd={(type, data) => handleAddElement(type, data)}
      />
      <AddCodeModal
        open={openCodeModal}
        onClose={() => setOpenCodeModal(false)}
        onAdd={(type, data) => handleAddElement(type, data)}
      />

      {/* Background Picker Modal for Current Slide */}
      <BackgroundPickerModal
        open={openBackgroundModal}
        onClose={() => setOpenBackgroundModal(false)}
        currentBackground={slide.background}
        onUpdate={handleBackgroundUpdate}
      />

      {/* Default Background Picker Modal */}
      <DefaultBackgroundPickerModal
        open={openDefaultBackgroundModal}
        onClose={() => setOpenDefaultBackgroundModal(false)}
        presentationId={presentationId}
        onUpdate={handleDefaultBackgroundUpdate}
      />

      {/* Edit Element Modal */}
      {getEditModal()}
    </Box> // Properly close the main <Box> component
  );
};

SlideEditor.propTypes = {
  presentationId: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    id: PropTypes.string.isRequired,
    elements: PropTypes.arrayOf(PropTypes.object).isRequired,
    fontFamily: PropTypes.string,
    background: PropTypes.shape({
      style: PropTypes.oneOf(['solid', 'gradient', 'image']).isRequired,
      color: PropTypes.string,
      gradient: PropTypes.shape({
        direction: PropTypes.string,
        colors: PropTypes.arrayOf(PropTypes.string),
      }),
      image: PropTypes.string,
      uploadedImage: PropTypes.string, // To handle uploaded images
    }),
  }).isRequired,
  updateSlide: PropTypes.func.isRequired,
};

export default SlideEditor;
