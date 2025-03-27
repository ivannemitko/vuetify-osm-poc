import { defineStore } from 'pinia';

import { KnownPlaceType } from '@/core';

export const usePlacesFilterStore = defineStore('placesFilter', () => {
  // State
  const types = ref<KnownPlaceType[]>([]);
  const isOpen = ref(false);

  // Getters
  const hasFilters = computed(() => types.value.length > 0);
  const isActive = computed(() => isOpen.value || hasFilters.value);

  // Actions
  const toggleFilter = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    // State
    types,
    isOpen,

    // Getters
    hasFilters,
    isActive,

    // Actions
    toggleFilter,
  };
});
