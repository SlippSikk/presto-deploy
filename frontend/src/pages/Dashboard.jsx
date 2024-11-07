import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid2,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPresentations, createPresentation } from '../services/presentationApi'; // To be implemented
import PresentationCard from '../components/PresentationCard'; // Extracted component

/**
 * Dashboard component that displays a list of presentations and allows creating new ones.
 */
const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [presentations, setPresentations] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPresentations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches all presentations for the authenticated user.
   */
  const fetchPresentations = async () => {
    try {
      const response = await getPresentations(); // API call to get presentations
      setPresentations(response.data.presentations);
    } catch (err) {
      setError('Failed to load presentations');
    }
  };

  /**
   * Handles the creation of a new presentation.
   */
  const handleCreatePresentation = async () => {
    if (!newPresentationName.trim()) {
      setError('Presentation name cannot be empty');
      return;
    }
    try {
      const response = await createPresentation(newPresentationName);
      setPresentations([...presentations, response.data.presentation]);
      setOpen(false);
      setNewPresentationName('');
      setError('');
    } catch (err) {
      setError('Failed to create presentation');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        New Presentation
      </Button>
      <Grid2 container spacing={3}>
        {presentations.map((presentation) => (
          <Grid2 item xs={12} sm={6} md={4} lg={3} key={presentation.id}>
            <PresentationCard presentation={presentation} />
          </Grid2>
        ))}
      </Grid2>

      {/* Create Presentation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Presentation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Presentation Name"
            type="text"
            fullWidth
            variant="standard"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePresentation} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
