<template>
  <!-- Main map container with ref for DOM access -->
  <div
    ref="mapContainer"
    class="map-element-container"
  >
    <!-- Leaflet will attach to this element -->
    <div
      ref="mapElement"
      class="map-element"
    />
  </div>

  <!-- Conditional map layers - only render when map is initialized -->
  <template v-if="mapInstance">
    <!-- Base Map Layers -->
    <MapLayerPlaces />
    <MapLayerUsers />

    <!-- Edit Layer (only shown when place form is active) -->
    <MapLayerPlaceEdit v-if="appState.isShowingPlaceForm" />
  </template>
</template>

<script setup lang="ts">
import * as L from 'leaflet';

import { useAppStateStore } from '@/stores/appState';
import { useMapStore } from '@/stores/map';

/**
 * Map configuration constants
 * - center: Default map center coordinates (Kyiv, Ukraine)
 * - zoom: Default zoom level
 * - maxBounds: Restrict map panning to reasonable limits
 * - tileLayer: OpenStreetMap tile server URL
 */
const MAP_CONFIG = {
  center: [50.4501, 30.5234] as L.LatLngTuple,
  zoom: 13,
  maxBounds: L.latLngBounds(L.latLng(85, 180), L.latLng(-85, -180)),
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

// Refs for DOM elements and map components
const mapContainer = ref<HTMLElement | null>(null);
const mapElement = ref<HTMLElement | null>(null);
const tileLayer = shallowRef<L.TileLayer | null>(null);

// Store references
const mapStore = useMapStore();
const appState = useAppStateStore();

// Computed map instance from store
const mapInstance = computed(() => mapStore.map);

// Resize observer instance
let resizeObserver: ResizeObserver | null = null;

/**
 * Initializes or reattaches the Leaflet map
 * - Creates new map instance if none exists
 * - Reattaches existing map to DOM if available
 * - Handles tile layer creation
 */
const initMap = () => {
  if (!mapElement.value) return;

  try {
    if (!mapInstance.value) {
      // Create new map instance with performance optimizations
      const newMapInstance = L.map(mapElement.value, {
        preferCanvas: true, // Better performance for many markers
        maxBounds: MAP_CONFIG.maxBounds,
      }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

      // Initialize and add tile layer with retina display support
      tileLayer.value = L.tileLayer(MAP_CONFIG.tileLayer, {
        maxZoom: 19,
      }).addTo(newMapInstance);

      // Store the map instance in Pinia store
      mapStore.setMap(newMapInstance);
    } else {
      // Reattach existing map to new DOM element
      mapElement.value.appendChild(mapInstance.value.getContainer());
      // Ensure proper sizing after reattachment
      mapInstance.value.invalidateSize();
    }
  } catch (error) {
    console.error('Map initialization error:', error);
  }
};

// Lifecycle hooks
onMounted(() => {
  initMap();

  // Set up resize observer to handle container size changes
  if (mapContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      // Debounced resize handling would be better for performance
      mapInstance.value?.invalidateSize({ animate: false });
    });
    resizeObserver.observe(mapContainer.value);
  }
});

onUnmounted(() => {
  // Cleanup while preserving map state
  if (mapInstance.value) {
    // Remove map from DOM but keep instance alive in store
    const container = mapInstance.value.getContainer();
    if (container.parentNode) {
      container.remove();
    }
  }

  // Cleanup resize observer
  resizeObserver?.disconnect();
});
</script>

<style lang="scss">
// Import required Leaflet CSS files
@import 'leaflet/dist/leaflet.css';
@import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';

.map-element-container {
  width: calc(100% - var(--v-layout-left) - var(--v-layout-right));
  height: calc(100% - var(--v-layout-top) - var(--v-layout-bottom));
  position: absolute;
  top: var(--v-layout-top);
  bottom: var(--v-layout-bottom);
  left: var(--v-layout-left);
  right: var(--v-layout-right);
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, bottom 0.3s, right 0.3s;
  z-index: 0; // Ensure proper stacking context
}

.map-element {
  width: 100%;
  height: 100%;
  // Leaflet will handle all map element styling
}
</style>
