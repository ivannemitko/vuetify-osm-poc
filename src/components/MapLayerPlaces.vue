<template>
  <div v-if="false">
    <!-- MapLayerPlaces - Visual rendering handled by Leaflet -->
  </div>
</template>

<script setup lang="ts">
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';

import * as L from 'leaflet';
import { debounce } from 'ts-debounce';
import type { ShallowRef } from 'vue';

import { usePlaceActions } from '@/composables/usePlaceActions';
import { convertPlacesToGeoJSON, type Place } from '@/core';
import { useMapStore } from '@/stores/map';
import { usePlaceStore } from '@/stores/places';
import { getPlaceMarkerIcon } from '@/utils/icons.utils';

const mapStore = useMapStore();
const mapInstance = computed(() => mapStore.map!);

const placeStore = usePlaceStore();
const placesLayer: ShallowRef<L.LayerGroup | null> = shallowRef(null);
const { viewPlace } = usePlaceActions();

// Configuration
const DEBOUNCE_DELAY = 300; // ms

// Reactive references
const filteredPlacesRef = toRef(placeStore, 'filteredPlaces');

// Debounced refresh function
const refreshLayer = debounce((places: Place[]) => {
  removeCurrentLayer();
  if (places?.length) {
    createNewLayer(places);
  }
}, DEBOUNCE_DELAY);

const createNewLayer = (places: Place[]) => {
  try {
    const newGeoJSON = convertPlacesToGeoJSON(places);

    placesLayer.value = L.geoJSON(newGeoJSON, {
      pointToLayer: (feature, latlng) => {
        const icon = getPlaceMarkerIcon(feature.properties.type);
        return L.marker(latlng, {
          icon,
          riseOnHover: true,
        });
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          click: () => viewPlace(feature.properties.id),
        });
      },
    });

    mapInstance.value.addLayer(placesLayer.value);
  } catch (error) {
    console.error('Error creating places layer:', error);
  }
};

const removeCurrentLayer = () => {
  try {
    if (placesLayer.value && mapInstance.value.hasLayer(placesLayer.value)) {
      mapInstance.value.removeLayer(placesLayer.value);
    }
    placesLayer.value = null;
  } catch (error) {
    console.error('Error removing places layer:', error);
  }
};

// Watch for place changes with debounced refresh
watch(filteredPlacesRef, (newPlaces) => {
  refreshLayer(newPlaces);
}, { immediate: true });

// Cleanup
onUnmounted(() => {
  refreshLayer.cancel();
  removeCurrentLayer();
});
</script>
