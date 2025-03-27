// TODO: Consider splitting this store into separate stores when:
// 1. The static and custom places logic diverges significantly (different lifecycle/requirements)
// 2. Performance issues emerge from combined reactivity
// 3. Testing becomes difficult due to mixed concerns
//
// Potential benefits:
// - Better separation of concerns (API vs localStorage persistence)
// - Independent loading states (static fetch vs user operations)
// - Smaller, more focused stores
// - Reduced re-renders from separate reactivity chains
//
// Potential drawbacks:
// - More complex component imports
// - Need for a composable to combine common operations
// - Migration effort for existing components
//
// Suggested split:
// - staticPlaceStore.ts (API-fetched, read-optimized, cache-controlled)
// - customPlaceStore.ts (localStorage-persisted, write-optimized)
// - usePlaces.ts composable (unified interface when needed)

import { defineStore } from 'pinia';
import { debounce } from 'ts-debounce';

import {
  type Coordinates,
  type CustomPlace,
  fetchPlaces,
  filterPlacesByTypes,
  type Place,
  type StaticPlace
} from '@/core';
import { useAppStateStore } from '@/stores/appState';
import { usePlacesFilterStore } from '@/stores/placesFilter';

// Constants
const STORAGE_KEY = 'custom_places_store';
const DEBOUNCE_DELAY = 1000;
const MAX_PERSIST_RETRIES = 3;
const CUSTOM_PLACE_ID_PREFIX = 'usr_';

// Utility functions
const generateCustomPlaceId = () => `${CUSTOM_PLACE_ID_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const handleError = (err: unknown): string => {
  return (err instanceof Error) ? err.message : 'An unexpected error occurred';
};

export const usePlaceStore = defineStore('place', () => {
  // Dependencies
  const placesFilterStore = usePlacesFilterStore();
  const appStateStore = useAppStateStore();

  // State
  const staticPlaces = ref<StaticPlace[]>([]);
  const customPlaces = ref<CustomPlace[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetched = ref<Date | null>(null);
  const persistRetryCount = ref(0);

  // Combined places getter
  const allPlaces = computed<Place[]>(() => [...staticPlaces.value, ...customPlaces.value]);

  const selectedPlace = computed(() => appStateStore.currentPlaceId ? getPlaceById(appStateStore.currentPlaceId) : null);

  // Initialize custom places from localStorage
  const initializeFromStorage = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed?.customPlaces)) {
          customPlaces.value = parsed.customPlaces.map((place: CustomPlace) => ({
            ...place,
            // Ensure coordinates are properly typed
            coordinates: place.coordinates as Coordinates,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to initialize from localStorage:', err);
      clearStorage();
    }
  };

  // Persist only custom places
  const persistCustomPlace = debounce(async () => {
    if (persistRetryCount.value >= MAX_PERSIST_RETRIES) {
      console.warn('Max persistence retries reached');
      return;
    }

    try {
      const dataToPersist = {
        customPlaces: customPlaces.value,
        _version: 1,
        _timestamp: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToPersist));
      persistRetryCount.value = 0;
    } catch (err) {
      console.error('Failed to persist custom places:', err);
      persistRetryCount.value += 1;
      const retryDelay = Math.min(1000 * 2 ** persistRetryCount.value, 30000);
      setTimeout(persistCustomPlace, retryDelay);
    }
  }, DEBOUNCE_DELAY);

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      persistRetryCount.value = 0;
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  };

  // Initialize
  initializeFromStorage();

  // Getters
  const filteredPlaces = computed(() => {
    return filterPlacesByTypes(allPlaces.value, placesFilterStore.types);
  });

  const hasPlaces = computed(() => allPlaces.value.length > 0);
  const isLoading = computed(() => loading.value);

  // Actions
  const fetchStaticPlaces = async (forceRefresh = false) => {
    if (loading.value) {
      return;
    }

    const isDataFresh = lastFetched.value
      && (new Date().getTime() - lastFetched.value.getTime()) < 300000;

    if (isDataFresh && !forceRefresh) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      staticPlaces.value = await fetchPlaces();
      lastFetched.value = new Date();
    } catch (err) {
      error.value = handleError(err);
      console.error('Failed to fetch static places:', err);
    } finally {
      loading.value = false;
    }
  };

  const createCustomPlace = (place: Omit<CustomPlace, 'id' | 'createdAt' | 'updatedAt' | 'isCustomPlace'>): CustomPlace => {
    const newPlace: CustomPlace = {
      ...place,
      id: generateCustomPlaceId(),
      isCustomPlace: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    customPlaces.value = [...customPlaces.value, newPlace];
    persistCustomPlace();
    return newPlace;
  };

  const updateCustomPlace = (id: string, updates: Partial<Omit<CustomPlace, 'id' | 'createdAt'>>): CustomPlace | null => {
    if (!id.startsWith(CUSTOM_PLACE_ID_PREFIX)) {
      console.warn('Cannot update non-custom place');
      return null;
    }

    const index = customPlaces.value.findIndex(p => p.id === id);
    if (index === -1) {
      console.warn(`Custom place with ID ${id} not found`);
      return null;
    }

    const updatedPlace: CustomPlace = {
      ...customPlaces.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    customPlaces.value = [
      ...customPlaces.value.slice(0, index),
      updatedPlace,
      ...customPlaces.value.slice(index + 1),
    ];

    persistCustomPlace();
    return updatedPlace;
  };

  const deleteCustomPlace = (id: string): boolean => {
    if (!id.startsWith(CUSTOM_PLACE_ID_PREFIX)) {
      console.warn('Cannot delete non-custom place');
      return false;
    }

    customPlaces.value = customPlaces.value.filter(p => p.id !== id);

    persistCustomPlace();
    return true;
  };

  const getPlaceById = (placeId: string | number): Place | undefined => {
    return allPlaces.value.find(place => place.id === placeId);
  };

  const reset = () => {
    staticPlaces.value = [];
    customPlaces.value = [];
    loading.value = false;
    error.value = null;
    lastFetched.value = null;
    clearStorage();
  };

  return {
    // State
    staticPlaces,
    customPlaces,
    loading,
    error,
    selectedPlace,
    lastFetched,

    // Getters
    allPlaces,
    filteredPlaces,
    hasPlaces,
    isLoading,

    // Actions
    fetchStaticPlaces,
    createCustomPlace,
    updateCustomPlace,
    deleteCustomPlace,
    getPlaceById,
    reset,
    clearStorage,
  };
});
