import { isCustomPlace } from '@/core';
import { MapMode, useAppStateStore } from '@/stores/appState';
import { usePlaceFormStore } from '@/stores/placeForm';
import { usePlaceStore } from '@/stores/places';

import { useSnackbar } from './useSnackbar';

export function usePlaceActions() {
  // Dependencies
  const { showError, showSuccess } = useSnackbar();
  const appState = useAppStateStore();
  const placeForm = usePlaceFormStore();
  const placeStore = usePlaceStore();

  // Actions with error handling
  const viewPlace = (placeId: string | number) => {
    appState.setMode(MapMode.VIEW_PLACE, placeId);
  };

  const startCreatePlace = () => {
    placeForm.resetForm();
    appState.setMode(MapMode.CREATE_PLACE);
  };

  const editPlace = async (placeId: string) => {
    try {
      const place = await placeStore.getPlaceById(placeId);
      if (!place) {
        showError('Place not found');
        return;
      }

      if (!isCustomPlace(place)) {
        showError('Only user-created places can be edited');
        return;
      }

      placeForm.initializeFromPlace(place);
      appState.setMode(MapMode.EDIT_PLACE, placeId);
    } catch (error) {
      showError('Failed to load place for editing');
      console.error(error);
    }
  };

  const deletePlace = async (placeId: string) => {
    try {
      await placeStore.deleteCustomPlace(placeId);
      appState.setMode(MapMode.DEFAULT, null);
      showSuccess('Place deleted successfully');
    } catch (error) {
      showError('Failed to delete place');
      console.error(error);
    }
  };

  return {
    // Actions
    viewPlace,
    startCreatePlace,
    editPlace,
    deletePlace,
  };
}
