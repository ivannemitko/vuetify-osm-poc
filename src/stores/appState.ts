import { defineStore } from 'pinia';

export enum MapMode {
  DEFAULT = 'default',
  VIEW_PLACE = 'view-place',
  CREATE_PLACE = 'create-place',
  EDIT_PLACE = 'edit-place',
}

export const useAppStateStore = defineStore('appState', () => {
  const currentMode = ref<MapMode>(MapMode.DEFAULT);
  const currentPlaceId = ref<string | number | null>(null);

  // Derived states
  const isEditingPlace = computed(() => currentMode.value === MapMode.EDIT_PLACE);

  const isCreatingPlace = computed(() => currentMode.value === MapMode.CREATE_PLACE);

  const isShowingPlaceForm = computed(() => [MapMode.CREATE_PLACE, MapMode.EDIT_PLACE].includes(currentMode.value));

  const isViewingPlace = computed(() => currentMode.value === MapMode.VIEW_PLACE);

  const isShowingAsidePanel = computed(() => [MapMode.EDIT_PLACE, MapMode.CREATE_PLACE, MapMode.VIEW_PLACE].includes(currentMode.value));

  // Actions
  const setMode = (mode: MapMode, placeId: string | number | null = null) => {
    currentMode.value = mode;
    currentPlaceId.value = placeId;
  };

  const resetMode = () => {
    currentMode.value = MapMode.DEFAULT;
    currentPlaceId.value = null;
  };

  return {
    currentMode,
    currentPlaceId,
    isEditingPlace,
    isCreatingPlace,
    isViewingPlace,
    isShowingPlaceForm,
    isShowingAsidePanel,
    setMode,
    resetMode,
  };
});
