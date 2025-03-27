<template>
  <v-form
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      v-model="placeForm.name"
      label="Name"
      :rules="[required]"
      required
      :maxlength="50"
      counter
      autofocus
    />

    <v-select
      v-model="placeForm.type"
      :items="placeTypeOptions"
      :prepend-icon="getPlaceTypeIcon(placeForm.type)"
      label="Type"
      required
      item-title="label"
      item-value="value"
    />

    <v-text-field
      v-model="placeForm.coordinateString"
      label="Coordinates (lat, lng)"
      :rules="[coordinatesRule]"
      required
      append-inner-icon="mdi-crosshairs-gps"
      @blur="placeForm.handleCoordinateBlur"
      @keyup.enter="placeForm.handleCoordinateBlur"
      @click:append-inner="useCurrentLocation"
    />

    <div class="d-flex justify-end mt-4">
      <v-btn
        type="submit"
        color="primary"
        :loading="isSubmitting"
        :disabled="!formValid"
      >
        {{ submitButtonLabel }}
        <template #loader>
          <v-progress-circular
            indeterminate
            size="24"
          />
        </template>
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { usePlaceActions } from '@/composables/usePlaceActions';
import { useSnackbar } from '@/composables/useSnackbar';
import { KnownPlaceType } from '@/core';
import { useAppStateStore } from '@/stores/appState';
import { useMapStore } from '@/stores/map';
import { usePlaceFormStore } from '@/stores/placeForm';
import { usePlaceStore } from '@/stores/places';
import { formatPlaceType } from '@/utils/formatPlaceType';
import { getPlaceTypeIcon } from '@/utils/icons.utils';

const { showError, showSuccess } = useSnackbar();
const mapStore = useMapStore();
const placeStore = usePlaceStore();
const placeForm = usePlaceFormStore();
const appState = useAppStateStore();
const { viewPlace } = usePlaceActions();

const isSubmitting = ref(false);

// Form validation
const required = (v: string) => !!v || 'Required';
const coordinatesRule = (v: string) => {
  if (!v.includes(',')) return 'Must include comma separator';

  const parts = v.split(',');
  if (parts.length !== 2) return 'Invalid format';

  const [latStr, lngStr] = parts;
  const lat = Number(latStr);
  const lng = Number(lngStr);

  if (isNaN(lat)) return 'Latitude must be a number';
  if (isNaN(lng)) return 'Longitude must be a number';
  if (lat < -90 || lat > 90) return 'Latitude must be between -90 and 90';
  if (lng < -180 || lng > 180) return 'Longitude must be between -180 and 180';

  return true;
};

const formValid = computed(() => {
  return placeForm.name &&
    placeForm.type &&
    coordinatesRule(placeForm.coordinateString) === true;
});

// Enhanced place type options with labels
const placeTypeOptions = computed(() => {
  return Object.values(KnownPlaceType).map(type => ({
    value: type,
    label: formatPlaceType(type),
    icon: getPlaceTypeIcon(type),
  }));
});

const submitButtonLabel = computed(() => {
  return appState.isEditingPlace ? 'Update' : 'Create';
});

// Get current map center
const useCurrentLocation = () => {
  placeForm.setCoordinates(...mapStore.getCenter());
};

// Initialize form
const initializeForm = async () => {
  try {
    if (appState.isEditingPlace && appState.currentPlaceId) {
      const place = await placeStore.getPlaceById(appState.currentPlaceId);
      if (place) {
        placeForm.initializeFromPlace(place);
      }
    } else {
      placeForm.resetForm({ coordinates: mapStore.getCenter() });
    }
  } catch (error) {
    showError('Failed to initialize form');
    console.error('Form initialization error:', error);
  }
};

// Form submission
const handleSubmit = async () => {
  if (!formValid.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    if (appState.isEditingPlace && appState.currentPlaceId) {
      await placeStore.updateCustomPlace(appState.currentPlaceId as string, placeForm.formData);
      showSuccess('Place updated successfully');
      viewPlace(appState.currentPlaceId);
    } else {
      const newPlace = await placeStore.createCustomPlace(placeForm.formData);
      showSuccess('Place created successfully');
      viewPlace(newPlace.id);
    }
  } catch (error) {
    showError('Failed to save place');
    console.error('Save error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(initializeForm);
</script>

<style scoped>
.v-btn {
  min-width: 120px;
}
</style>
