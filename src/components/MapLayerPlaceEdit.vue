<template>
  <div v-if="false">
    <!-- MapLayerPlaceEdit - Visual rendering handled by Leaflet -->
  </div>
  <PlaceFormMapInfo />
</template>

<script setup lang="ts">
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';

import * as L from 'leaflet';

import { useMapStore } from '@/stores/map';
import { usePlaceFormStore } from '@/stores/placeForm';
import { getPlaceMarkerIcon } from '@/utils/icons.utils';

const mapStore = useMapStore();

const mapInstance = computed(() => mapStore.map!);

const placeForm = usePlaceFormStore();

const editMarker = shallowRef<L.Marker | null>(null);

// Initialize the edit marker
const initializeMarker = () => {
  if (!mapInstance.value) {
    return;
  }

  // Remove existing marker if any
  if (editMarker.value) {
    editMarker.value.remove();
  }

  // Create new draggable marker
  editMarker.value = L.marker(
    placeForm.coordinates,
    {
      draggable: true,
      icon: getPlaceMarkerIcon(placeForm.type, 'red'),
      zIndexOffset: 1000,
    },
  ).addTo(mapInstance.value);

  // Handle drag events
  editMarker.value.on('dragend', (e) => {
    const newPos = e.target.getLatLng();
    placeForm.setCoordinates(newPos.lat, newPos.lng);
  });
};

// Update marker when coordinates change
watch(
  () => [...placeForm.coordinates], // Deep watch coordinates array
  () => {
    if (editMarker.value) {
      editMarker.value.setLatLng(placeForm.coordinates);
    }
  },
);

// Update marker icon when type changes
watch(
  () => placeForm.type,
  (newType) => {
    if (editMarker.value) {
      editMarker.value.setIcon(getPlaceMarkerIcon(newType, 'red'));
    }
  },
);

// Initialize on mount
onMounted(() => {
  initializeMarker();
});

// Cleanup on unmount
onUnmounted(() => {
  if (editMarker.value) {
    editMarker.value.remove();
    editMarker.value = null;
  }
});
</script>
