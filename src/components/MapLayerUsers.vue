<template>
  <div v-if="false">
    <!-- MapLayerUsers - Visual rendering handled by Leaflet -->
  </div>
</template>

<script setup lang="ts">
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';

import * as L from 'leaflet';
import { debounce } from 'ts-debounce';
import type { ShallowRef } from 'vue';

import { convertUsersToGeoJSON, type User, type UserWithDistance } from '@/core';
import { useMapStore } from '@/stores/map';
import { usePlaceStore } from '@/stores/places';
import { useUserStore } from '@/stores/users';
import { formatDistance } from '@/utils/formatDistance';

const userStore = useUserStore();
const placeStore = usePlaceStore();
const mapStore = useMapStore();

const mapInstance = computed(() => mapStore.map!);

const usersLayer: ShallowRef<L.LayerGroup | null> = shallowRef(null);
const DEBOUNCE_DELAY = 300; // ms

// Marker icons configuration
const userMarkerIcon = L.AwesomeMarkers.icon({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  prefix: 'mdi',
  icon: 'account',
  markerColor: 'blue',
});

const selectedUserMarkerIcon = L.AwesomeMarkers.icon({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  prefix: 'mdi',
  icon: 'account-check',
  markerColor: 'green',
});

// Reactive references
const users = toRef(userStore, 'users');
const closestUsers = toRef(userStore, 'closestUsers');

// Debounced refresh function
const refreshLayer = debounce((users: User[], closestUsers: UserWithDistance[]) => {
  removeCurrentLayer();
  if (users?.length) {
    createNewLayer(users, closestUsers);
  }
}, DEBOUNCE_DELAY);

const createNewLayer = (users: User[], closestUsers: UserWithDistance[]) => {
  try {
    const newGeoJSON = convertUsersToGeoJSON(users);

    usersLayer.value = L.geoJSON(newGeoJSON, {
      pointToLayer: (feature, latlng) => {
        const isClosestUser = closestUsers?.some(user => user.id === feature.properties.id);
        return L.marker(latlng, {
          icon: isClosestUser ? selectedUserMarkerIcon : userMarkerIcon,
          riseOnHover: true,
        });
      },
      onEachFeature: (feature, layer) => {
        const closestUser = closestUsers?.find(u => u.id === feature.properties.id);
        const distanceText = closestUser && placeStore.selectedPlace
          ? `${formatDistance(closestUser.distance)} to ${placeStore.selectedPlace.name}`
          : '';

        layer.bindPopup(`
          <div class="user-popup">
            <h4>${feature.properties.name}</h4>
            ${distanceText ? `<p class="distance">${distanceText}</p>` : ''}
          </div>
        `);
      },
    }).addTo(mapInstance.value);
  } catch (error) {
    console.error('Error creating users layer:', error);
  }
};

const removeCurrentLayer = () => {
  try {
    if (usersLayer.value && mapInstance.value.hasLayer(usersLayer.value)) {
      mapInstance.value.removeLayer(usersLayer.value);
    }
    usersLayer.value = null;
  } catch (error) {
    console.error('Error removing users layer:', error);
  }
};

// Watch for changes with debounced refresh
watch([users, closestUsers], ([newUsers, newClosestUsers]) => {
  refreshLayer(newUsers, newClosestUsers);
}, { immediate: true });

// Cleanup
onUnmounted(() => {
  refreshLayer.cancel();
  removeCurrentLayer();
});
</script>

<style>
.user-popup {
  min-width: 150px;
}

.closest-user {
  color: green;
  font-weight: bold;
  margin-top: 5px;
}
</style>
