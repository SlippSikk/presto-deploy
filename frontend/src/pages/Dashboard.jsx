import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPresentations, createPresentation } from '../services/presentationApi'; // To be implemented

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [presentations, setPresentations] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const response = await getPresentations(); // API call to get presentations
      setPresentations(response.data.presentations);
    } catch (err) {
      setError('Failed to load presentations');
    }
  };

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
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 3 }}>
        New Presentation
      </Button>
      <Grid container spacing={3}>
        {presentations.map((presentation) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={presentation.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{presentation.name}</Typography>
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
                  <Typography variant="body2" color="textSecondary">
                    {presentation.description}
                  </Typography>
                )}
                <Typography variant="caption">
                  {presentation.slides.length} {presentation.slides.length === 1 ? 'Slide' : 'Slides'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/presentation/${presentation.id}`}>
                  Open
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
