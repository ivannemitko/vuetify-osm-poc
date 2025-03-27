<template>
  <v-card
    class="w-100"
    elevation="0"
  >
    <v-card-title class="place-view-info--title">
      {{ place.name }}
    </v-card-title>
    <v-card-item>
      <template #prepend>
        <v-icon
          :icon="getPlaceTypeIcon(place.type)"
        />
      </template>

      <v-chip
        size="small"
      >
        {{ formatPlaceType(place.type) }}
      </v-chip>
    </v-card-item>

    <v-card-text>
      <div class="d-flex align-center my-2">
        <div class="flex-fill">
          <v-icon
            class="mr-2"
            icon="mdi-map-marker"
          />
          <span>
            {{ formatCoordinates(place.coordinates) }}
          </span>
          <v-btn
            icon="mdi-content-copy"
            variant="text"
            size="x-small"
            class="ml-2"
            @click="copyCoordinates"
          />
        </div>
        <div class="flex-0-0 mr-4">
          <v-btn
            icon="mdi-arrow-expand-all"
            variant="text"
            size="small"
            color="primary"
            @click="fitBounds"
          />
        </div>
      </div>

      <v-divider class="my-4" />

      <template v-if="usersStore.closestUsers.length > 0">
        <v-list
          lines="two"
          density="comfortable"
        >
          <v-list-subheader class="font-weight-bold">
            Nearby Users ({{ usersStore.closestUsers.length }})
          </v-list-subheader>

          <v-list-item
            v-for="user in usersStore.closestUsers"
            :key="user.id"
            :title="user.name"
          >
            <template #prepend>
              <UserAvatar :user="user" />
            </template>

            <template #subtitle>
              <span class="text-caption">
                {{ formatDistance(user.distance) }} away
              </span>
            </template>

            <template #append>
              <v-btn
                icon="mdi-crosshairs-gps"
                variant="text"
                size="small"
                color="primary"
                @click="focusOnUser(user)"
              />
            </template>
          </v-list-item>
        </v-list>
      </template>
      <v-alert
        v-else
        type="info"
        variant="tonal"
        class="my-4"
      >
        No nearby users found
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

import { useSnackbar } from '@/composables/useSnackbar';
import { getBoundsForPlacesAndUsers, getUserLatLng, type Place, type UserWithDistance } from '@/core';
import { useMapStore } from '@/stores/map';
import { useUserStore } from '@/stores/users';
import { formatCoordinates } from '@/utils/formatCoordinates';
import { formatDistance } from '@/utils/formatDistance';
import { formatPlaceType } from '@/utils/formatPlaceType';
import { getPlaceTypeIcon } from '@/utils/icons.utils';

const props = defineProps<{
  place: Place;
}>();

const usersStore = useUserStore();
const mapStore = useMapStore();
const { copy: copyToClipboard } = useClipboard();
const { showInfo } = useSnackbar();

const copyCoordinates = async () => {
  await copyToClipboard(formatCoordinates(props.place.coordinates));
  showInfo('Coordinates copied to clipboard');
};

const fitBounds = () => {
  mapStore.fitBounds(getBoundsForPlacesAndUsers([props.place], usersStore.closestUsers));
};

const focusOnUser = (user: UserWithDistance) => {
  mapStore.panTo(getUserLatLng(user));
};
</script>

<style scoped>
.v-card-item {
  padding-bottom: 0;
}
.place-view-info--title {
  white-space: normal;
}
</style>
