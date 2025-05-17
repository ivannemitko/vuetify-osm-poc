<template>
  <div v-if="false">
    <!-- MapLayerPlaces - Visual rendering handled by Leaflet and PixiJS -->
  </div>
</template>

<script setup lang="ts">
import 'leaflet-pixi-overlay';

import * as L from 'leaflet';
import { Assets, Container, Sprite } from 'pixi.js';
import { debounce } from 'ts-debounce';
import type { ShallowRef } from 'vue';

import { usePlaceActions } from '@/composables/usePlaceActions';
import { type Place } from '@/core';
import { useMapStore } from '@/stores/map';
import { usePlaceStore } from '@/stores/places';

const mapStore = useMapStore();
const mapInstance = computed(() => mapStore.map!);

const placeStore = usePlaceStore();
const placesLayer: ShallowRef<L.PixiOverlay | null> = shallowRef(null);
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

const createNewLayer = async (places: Place[]) => {
  try {
    console.log('createNewLayer', places);

    const markerTexture = await Assets.load('../img/marker-icon.png');
    const pixiContainer = new Container();
    const markers: Sprite[] = [];

    // Create markers for each place
    places.forEach(() => {
      const marker = Sprite.from(markerTexture);
      marker.anchor.set(0.5, 1);
      marker.eventMode = 'dynamic'; // Enable interactivity
      marker.cursor = 'pointer';
      markers.push(marker);
      pixiContainer.addChild(marker);
    });

    let firstDraw = true;
    let prevZoom: number | undefined;

    const pixiOverlay = L.pixiOverlay((utils) => {
      const zoom = utils.getMap().getZoom();
      const project = utils.latLngToLayerPoint;
      const scale = utils.getScale();

      if (firstDraw) {
        places.forEach((place: Place, index) => {
          const markerCoords = project([place.coordinates[0], place.coordinates[1]]);
          markers[index].x = markerCoords.x;
          markers[index].y = markerCoords.y;
        });
      }

      if (firstDraw || prevZoom !== zoom) {
        markers.forEach(marker => {
          marker.scale.set(1 / scale);
        });
      }

      firstDraw = false;
      prevZoom = zoom;
      utils.getRenderer().render(pixiContainer);
    }, pixiContainer);

    // Store the overlay as our layer
    placesLayer.value = pixiOverlay;
    pixiOverlay.addTo(mapInstance.value);

    // Add click handlers
    places.forEach((place, index) => {
      markers[index].eventMode = 'dynamic';
      markers[index].on('click', () => viewPlace(place.id));
    });
  } catch (error) {
    console.error('Error creating places layer:', error);
  }
};

const removeCurrentLayer = () => {
  try {
    if (placesLayer.value && mapInstance.value.hasLayer(placesLayer.value)) {
      console.log('removeCurrentLayer');
      // TODO !?
      // mapInstance.value.removeLayer(placesLayer.value);
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
