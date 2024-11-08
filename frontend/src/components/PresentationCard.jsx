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

/**
 * PresentationCard component that displays individual presentation details.
 *
 * @param {object} props - React props.
 * @param {object} props.presentation - Presentation data.
 * @returns {JSX.Element} A card displaying presentation information.
 */
const PresentationCard = ({ presentation }) => {
  const { id, name, thumbnail, description, slides } = presentation;

  return (
    <Card
      sx={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
        },
        // Aspect Ratio: 2:1
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Container to maintain aspect ratio */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '50%', // 2:1 aspect ratio
        }}
      >
        {/* Thumbnail Image */}
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

      {/* Presentation Details */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 1, display: 'block' }}
        >
          {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions>
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
