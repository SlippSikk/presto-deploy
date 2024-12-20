import { useState, useContext } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { StoreContext } from '../context/StoreContext';
import PresentationCard from '../components/PresentationCard';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs

/**
 * Dashboard component that displays a list of presentations and allows creating new ones.
 */
const Dashboard = () => {
  const {
    store,
    loading,
    error,
    addPresentation,
  } = useContext(StoreContext);
  const [open, setOpen] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [dialogError, setDialogError] = useState('');

  /**
   * Handles the creation of a new presentation.
   */
  const handleCreatePresentation = async () => {
    if (!newPresentationName.trim()) {
      setDialogError('Presentation name cannot be empty');
      return;
    }

    const newPresentation = {
      id: uuidv4(), // Generates a unique UUID
      name: newPresentationName,
      thumbnail: '', // Placeholder; can be updated later
      description: '',
      slides: [],
      favorited: false, // Initialize favorited to false
    };

    try {
      await addPresentation(newPresentation);
      setOpen(false);
      setNewPresentationName('');
      setDialogError('');
    } catch (err) {
      setDialogError('Failed to create presentation');
      console.log(err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          backgroundColor: 'background.default', // Ensure background adapts to theme
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Sort presentations: favorited first
  const sortedPresentations = [...store.presentations].sort((a, b) => {
    if (a.favorited === b.favorited) return 0;
    return a.favorited ? -1 : 1;
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="text.primary">
        Dashboard
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => {}} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
        aria-label="Create New Presentation"
      >
        New Presentation
      </Button>
      <Grid container spacing={3}>
        {sortedPresentations.length > 0 ? (
          sortedPresentations.map((presentation) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={presentation.id}
              display="flex"
            >
              <PresentationCard presentation={presentation} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              No presentations available.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Create Presentation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="create-presentation-dialog">
        <DialogTitle id="create-presentation-dialog">Create New Presentation</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Alert severity="error" onClose={() => setDialogError('')} sx={{ mb: 2 }}>
              {dialogError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Presentation Name"
            type="text"
            fullWidth
            variant="standard"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
            aria-label="Presentation Name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} aria-label="Cancel Creating Presentation">Cancel</Button>
          <Button onClick={handleCreatePresentation} variant="contained" color="primary" aria-label="Create Presentation">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
