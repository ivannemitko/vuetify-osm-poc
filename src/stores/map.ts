import * as L from 'leaflet';
import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', () => {
  const map = shallowRef<L.Map | null>(null);

  // Set the map instance (call this once after initialization)
  const setMap = (newMap: L.Map) => {
    if (map.value) {
      console.warn('Map instance is already set. Overwriting existing instance.');
    }
    map.value = newMap;
  };

  // Getters
  const getCenter = (): [number, number] => {
    const latLng = map.value!.getCenter();
    return [latLng.lat, latLng.lng];
  };

  // Actions
  const panTo = ([lat, lng]: L.LatLngTuple) => {
    map.value?.panTo([lat, lng]);
  };

  const fitBounds = (bounds: L.LatLngBounds) => {
    map.value?.fitBounds(bounds);
  };

  return {
    map,
    setMap,

    // Getters
    getCenter,

    // Actions
    panTo,
    fitBounds,
  };
});
