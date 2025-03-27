import { MapMode, useAppStateStore } from '@/stores/appState';

export function useMapControls() {
  const appState = useAppStateStore();

  const controls = computed(() => ({
    filterPlaces: true, // Always available
    createPlace: appState.currentMode === MapMode.DEFAULT,
  }));

  const isControlAvailable = (control: keyof typeof controls.value) => {
    return controls.value[control];
  };

  return {
    controls,
    isControlAvailable,
  };
}
