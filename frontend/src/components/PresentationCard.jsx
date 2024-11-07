import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
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
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {presentation.name}
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingTop: '50%', // 2:1 ratio
            backgroundColor: presentation.thumbnail ? 'transparent' : 'grey.300',
            backgroundImage: presentation.thumbnail ? `url(${presentation.thumbnail})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: 2,
          }}
        />
        {presentation.description && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {presentation.description}
          </Typography>
        )}
        <Typography variant="caption" color="textSecondary">
          {presentation.slides.length} {presentation.slides.length === 1 ? 'Slide' : 'Slides'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/presentation/${presentation.id}`}>
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
    slides: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default PresentationCard;
