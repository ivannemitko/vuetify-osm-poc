import { defineStore } from 'pinia';

import { KnownPlaceType, type PlaceType } from '@/core';
import { roundToPrecision } from '@/utils/roundToPrecision';

interface PlaceForm {
  name: string;
  type: PlaceType;
  coordinates: [number, number];
}

export const usePlaceFormStore = defineStore('placeForm', () => {
  // State
  const name = ref('');
  const type = ref<PlaceType>(KnownPlaceType.Store);
  const coordinates = ref<[number, number]>([0, 0]);
  const rawCoordinateString = ref('');
  const isEditing = ref(false);
  const originalValues = ref<PlaceForm | null>(null);

  // Getters
  const hasChanged = computed(() => {
    if (!originalValues.value) {
      return false;
    }

    return (
      name.value !== originalValues.value.name ||
      type.value !== originalValues.value.type ||
      coordinates.value[0] !== originalValues.value.coordinates[0] ||
      coordinates.value[1] !== originalValues.value.coordinates[1]
    );
  });

  const coordinateString = computed({
    get: () => rawCoordinateString.value || `${coordinates.value[0]}, ${coordinates.value[1]}`,
    set: (value: string) => {
      rawCoordinateString.value = value; // Store raw value without reformatting

      // Only update coordinates when input is complete (e.g., comma present)
      if (value.includes(',')) {
        const [lat, lng] = value.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          coordinates.value = [lat, lng];
        }
      }
    },
  });

  const handleCoordinateBlur = () => {
    if (rawCoordinateString.value) {
      const [lat, lng] = rawCoordinateString.value.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        coordinates.value = [lat, lng];
        rawCoordinateString.value = `${coordinates.value[0]}, ${coordinates.value[1]}`; // Reformatted
      }
    }
  };

  const formData = computed<PlaceForm>(() => ({
    name: name.value,
    type: type.value,
    coordinates: [...coordinates.value] as [number, number],
  }));

  // Actions
  const setName = (newName: string) => {
    name.value = newName.trim();
  };

  const setType = (newType: PlaceType) => {
    type.value = newType;
  };

  const setCoordinates = (lat: number, lng: number) => {
    const PRECISION_LIMIT = 6;
    coordinates.value = [
      roundToPrecision(lat, PRECISION_LIMIT),
      roundToPrecision(lng, PRECISION_LIMIT),
    ];

    rawCoordinateString.value = `${coordinates.value[0]}, ${coordinates.value[1]}`;
  };

  const initializeFromPlace = (place: PlaceForm) => {
    name.value = place.name;
    type.value = place.type;
    coordinates.value = [...place.coordinates];
    isEditing.value = true;
    originalValues.value = { ...place };
  };

  const resetForm = (options?: {
    coordinates?: [number, number];
  }) => {
    name.value = '';
    type.value = KnownPlaceType.Store;
    coordinates.value = options?.coordinates || [0, 0];
    isEditing.value = false;
    originalValues.value = null;
  };

  return {
    // State
    name,
    type,
    coordinates,
    isEditing,

    // Getters
    hasChanged,
    coordinateString,
    formData,

    // Actions
    setName,
    setType,
    setCoordinates,
    handleCoordinateBlur,
    initializeFromPlace,
    resetForm,
  };
});
