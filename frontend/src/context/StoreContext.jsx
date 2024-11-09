import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStore, setStore } from '../services/api';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';
import defaultThumbnail from '../assets/default-thumbnail.jpg';

/**
 * StoreContext provides store data and functions to manage presentations and slides.
 */
export const StoreContext = createContext();

/**
 * StoreProvider component that wraps the application and provides store data and management functions.
 *
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} StoreContext.Provider with store data and management functions.
 */
export const StoreProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading, auth } = useContext(AuthContext);
  const [store, setStoreState] = useState({ presentations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetches the store data when the user is authenticated.
   */
  useEffect(() => {
    const fetchStore = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await getStore();
          console.log('Store Data from API:', response.data); // Debugging line

          // Corrected assignment: Ensure presentations are correctly accessed
          const fetchedStore = response.data && response.data.store && Array.isArray(response.data.store.presentations)
            ? response.data.store
            : { presentations: [] };

          setStoreState(fetchedStore);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching store data:', err); // Enhanced error logging
          setError('Failed to load store data.');
          setStoreState({ presentations: [] });
          setLoading(false);
        }
      } else {
        setStoreState({ presentations: [] });
        setLoading(false);
      }
    };

    fetchStore();
  }, [isAuthenticated]);

  /**
   * Updates the entire store on the backend.
   *
   * @param {object} updatedStore - The updated store object.
   */
  const updateStoreData = async (updatedStore) => {
    try {
      await setStore(updatedStore); // Ensure backend accepts store data directly
      setStoreState(updatedStore);
      console.log('Store updated successfully.');
    } catch (err) {
      console.error('Error updating store data:', err);
      setError('Failed to update store data.');
    }
  };

  /**
   * Adds a new presentation to the store.
   *
   * @param {object} presentation - The presentation object to add.
   */
  const addPresentation = async (presentation) => {
    // Create an initial slide with a unique ID
    const initialSlide = {
      id: `slide-${Date.now()}`, // Unique ID for the slide
      content: '', // Default empty content
    };

    // Add the initial slide and default thumbnail to the presentation's slides array
    const newPresentation = {
      ...presentation,
      slides: [initialSlide],
      thumbnail: defaultThumbnail, // Set the default thumbnail
    };

    const updatedStore = {
      ...store,
      presentations: [...store.presentations, newPresentation],
    };

    await updateStoreData(updatedStore);
  };

  

  /**
   * Updates an existing presentation in the store.
   *
   * @param {string} presentationId - ID of the presentation to update.
   * @param {object} updatedPresentation - The updated presentation object.
   */
  const updatePresentation = async (presentationId, updatedPresentation) => {
    const updatedStore = {
      ...store,
      presentations: store.presentations.map((presentation) =>
        presentation.id === presentationId ? updatedPresentation : presentation
      ),
    };
    await updateStoreData(updatedStore);
  };

  /**
   * Deletes a presentation from the store.
   *
   * @param {string} presentationId - ID of the presentation to delete.
   */
  const deletePresentation = async (presentationId) => {
    const updatedStore = {
      ...store,
      presentations: store.presentations.filter(
        (presentation) => presentation.id !== presentationId
      ),
    };
    await updateStoreData(updatedStore);
  };

  /**
   * Adds a new slide to a specific presentation.
   *
   * @param {string} presentationId - ID of the presentation.
   * @param {object} slide - The slide object to add.
   */
  const addSlide = async (presentationId, slide) => {
    const updatedStore = {
      ...store,
      presentations: store.presentations.map((presentation) =>
        presentation.id === presentationId
          ? { ...presentation, slides: [...presentation.slides, slide] }
          : presentation
      ),
    };
    await updateStoreData(updatedStore);
  };

  /**
   * Updates an existing slide in a specific presentation.
   *
   * @param {string} presentationId - ID of the presentation.
   * @param {string} slideId - ID of the slide to update.
   * @param {object} updatedSlide - The updated slide object.
   */
  const updateSlide = async (presentationId, slideId, updatedSlide) => {
    const updatedStore = {
      ...store,
      presentations: store.presentations.map((presentation) =>
        presentation.id === presentationId
          ? {
              ...presentation,
              slides: presentation.slides.map((slide) =>
                slide.id === slideId ? updatedSlide : slide
              ),
            }
          : presentation
      ),
    };
    await updateStoreData(updatedStore);
  };

  /**
   * Deletes a slide from a specific presentation.
   *
   * @param {string} presentationId - ID of the presentation.
   * @param {string} slideId - ID of the slide to delete.
   */
  const deleteSlide = async (presentationId, slideId) => {
    const presentation = store.presentations.find(p => p.id === presentationId);
  
    // Check if there is only one slide in the presentation
    if (presentation.slides.length <= 1) {
      throw new Error('Cannot delete the only slide in the presentation. Delete the presentation instead.');
    }
  
    const updatedStore = {
      ...store,
      presentations: store.presentations.map((presentation) =>
        presentation.id === presentationId
          ? {
              ...presentation,
              slides: presentation.slides.filter((slide) => slide.id !== slideId),
            }
          : presentation
      ),
    };
  
    await updateStoreData(updatedStore);
  };
  

  return (
    <StoreContext.Provider
      value={{
        store,
        loading,
        error,
        addPresentation,
        updatePresentation,
        deletePresentation,
        addSlide,
        updateSlide,
        deleteSlide,
        setStoreState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreProvider;