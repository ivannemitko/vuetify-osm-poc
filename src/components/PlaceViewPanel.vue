<template>
  <div class="fill-height d-flex flex-column">
    <v-toolbar
      density="compact"
    >
      <v-toolbar-title class="font-weight-bold">
        Place Details
      </v-toolbar-title>

      <v-spacer />

      <template v-if="selectedPlace">
        <v-btn
          v-if="canEdit"
          icon="mdi-trash-can"
          variant="text"
          size="small"
          color="red"
          data-testid="edit-place-btn"
          @click="startDeleting"
        />

        <v-btn
          v-if="canEdit"
          icon="mdi-pencil"
          variant="text"
          size="small"
          color="primary"
          data-testid="edit-place-btn"
          :loading="isEditing"
          @click="startEditing"
        />

        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          data-testid="close-panel-btn"
          @click="closePanel"
        />
      </template>
    </v-toolbar>

    <div
      v-if="selectedPlace"
      class="flex-fill overflow-auto pa-1"
    >
      <PlaceViewInfo :place="selectedPlace" />

      <v-divider class="my-4" />
    </div>

    <div
      v-else
      class="d-flex align-center justify-center fill-height"
    >
      <v-alert
        type="warning"
        icon="mdi-alert"
        variant="tonal"
      >
        No place selected
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlaceActions } from '@/composables/usePlaceActions';
import { useSnackbar } from '@/composables/useSnackbar';
import { useAppStateStore } from '@/stores/appState';
import { usePlaceStore } from '@/stores/places';
import {isCustomPlace} from "@/core";

const placeStore = usePlaceStore();
const appState = useAppStateStore();
const { editPlace, deletePlace } = usePlaceActions();
const { showError } = useSnackbar();

const isEditing = ref(false);
const selectedPlace = computed(() => placeStore.selectedPlace);

const canEdit = computed(() => {
  const place = selectedPlace.value;
  return place && isCustomPlace(place);
});

const startEditing = async () => {
  if (!appState.currentPlaceId) return;

  isEditing.value = true;
  try {
    await editPlace(String(appState.currentPlaceId));
  } catch (error) {
    showError('Failed to start editing place');
    console.error('Editing error:', error);
  } finally {
    isEditing.value = false;
  }
};

const startDeleting = async () => {
  if (!appState.currentPlaceId) return;

  try {
    await deletePlace(String(appState.currentPlaceId));
  } catch (error) {
    showError('Failed to delete place');
    console.error('Deletion error:', error);
  }
};

const closePanel = () => {
  appState.resetMode();
};
</script>
