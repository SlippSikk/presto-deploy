import { useContext } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StoreContext } from '../context/StoreContext';
import { Star, StarBorder } from '@mui/icons-material';

const PresentationCard = ({ presentation }) => {
  const { id, name, thumbnail, description, slides, favorited } = presentation;
  const { updatePresentation } = useContext(StoreContext);

  /**
   * Toggles the favorited state of the presentation.
   */
  const handleToggleFavorite = async () => {
    try {
      await updatePresentation(id, { ...presentation, favorited: !favorited });
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      // Optionally, handle error (e.g., show a notification)
    }
  };

  return (
    <Card
      sx={{
        width: 400,           // Set a fixed width
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

      <CardContent sx={{ flexGrow: 1, paddingTop: '0px', paddingBottom: '0px', paddingLeft: '8px', paddingRight: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0.5 }}>
            {name}
          </Typography>
          <IconButton
            onClick={handleToggleFavorite}
            aria-label={favorited ? 'Unfavorite presentation' : 'Favorite presentation'}
            sx={{ ml: 'auto' }}
          >
            {favorited ? <Star color="warning" /> : <StarBorder />}
          </IconButton>
        </Box>
        {description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
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

      <CardActions sx={{ paddingTop: '5px', paddingBottom: '5px', paddingLeft: '8px', paddingRight: '8px' }}>
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
    favorited: PropTypes.bool, // Ensure favorited prop is included
  }).isRequired,
};

export default PresentationCard;
