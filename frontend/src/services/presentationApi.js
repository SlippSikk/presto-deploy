import api from './api';

// Fetch all presentations
export const getPresentations = () => {
  return api.get('/presentations'); // Adjust endpoint as per backend
};

// Create a new presentation
export const createPresentation = (name) => {
  return api.post('/presentations', { name });
};
