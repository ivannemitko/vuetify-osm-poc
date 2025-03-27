import { defineStore } from 'pinia';

import { usePlaceStore } from '@/stores/places';
import { useUserStore } from '@/stores/users';

export const useAppStore = defineStore('app', () => {
  // Dependencies
  const userStore = useUserStore();
  const placeStore = usePlaceStore();

  // State
  const loadingCounter = ref(0);
  const error = ref<string | null>(null);

  // Getters
  const isLoading = computed(() => loadingCounter.value > 0);
  const hasError = computed(() => error.value !== null);

  // Actions
  const startLoading = () => {
    loadingCounter.value += 1;
  };

  const finishLoading = () => {
    if (loadingCounter.value > 0) {
      loadingCounter.value -= 1;
    }
  };

  const setError = (message: string | null) => {
    error.value = message;
  };

  const resetError = () => {
    error.value = null;
  };

  // Watch for loading states from other stores
  watch(
    () => userStore.isLoading || placeStore.isLoading,
    (isLoading) => {
      if (isLoading) {
        startLoading();
      } else {
        finishLoading();
      }
    },
    { immediate: true },
  );

  // Watch for errors from other stores
  watch(
    () => userStore.error || placeStore.error,
    (storeError) => {
      if (storeError) {
        setError(storeError);
      }
    },
    { immediate: true },
  );

  return {
    // State
    loadingCounter,
    error,

    // Getters
    isLoading,
    hasError,

    // Actions
    startLoading,
    finishLoading,
    setError,
    resetError,
  };
});
