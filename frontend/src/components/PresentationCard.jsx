// src/components/PresentationCard.jsx

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PresentationCard = ({ presentation }) => {
  const { id, name, thumbnail, description, slides } = presentation;

  return (
    <Card
      sx={{
        width: 400,           // Set a fixed width (e.g., 300px)
        height: 200,          // Height is half of the width for a 2:1 aspect ratio
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {thumbnail ? (
          <CardMedia
            component="img"
            image={thumbnail}
            alt={`${name} Thumbnail`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1" color="textSecondary">
              No Thumbnail
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, paddingTop: '0px', paddingBottom: '0px', paddingLeft: '8px', paddingRight: '8px' }}> {/* Reduce padding */}
        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0.5 }}> {/* Reduce bottom margin */}
          {name}
        </Typography>
        {description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}> {/* Reduce bottom margin */}
            {description}
          </Typography>
        )}
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 0.5 }}
        >
          {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'}
        </Typography>
      </CardContent>

      <CardActions sx={{ paddingTop: '5px', paddingBottom: '5px', paddingLeft: '8px', paddingRight: '8px' }}> {/* Reduce padding */}
        <Button
          size="small"
          component={Link}
          to={`/presentation/${id}`}
          variant="outlined"
          color="primary"
          aria-label={`Open presentation ${name}`}
        >
          Open
        </Button>
      </CardActions>
    </Card>
  );
};

PresentationCard.propTypes = {
  presentation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    description: PropTypes.string,
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default PresentationCard;
