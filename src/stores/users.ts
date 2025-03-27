import { defineStore } from 'pinia';

import { fetchUsers, findClosestUsers, type User } from '@/core';
import { usePlaceStore } from '@/stores/places';

// Constants
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

// Utility functions
const handleError = (err: unknown): string => {
  return (err instanceof Error) ? err.message : 'An unexpected error occurred';
};

export const useUserStore = defineStore('user', () => {
  // Dependencies
  const placeStore = usePlaceStore();

  // State
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastFetched = ref<Date | null>(null);
  const cacheVersion = ref(1);

  // Computed properties
  const closestUsers = computed(() => {
    if (!placeStore.selectedPlace || users.value.length === 0) {
      return [];
    }
    return findClosestUsers(placeStore.selectedPlace, users.value);
  });

  // Getters
  const hasUsers = computed(() => users.value.length > 0);
  const userCount = computed(() => users.value.length);

  // Actions
  const fetchUsersAction = async (forceRefresh = false) => {
    if (isLoading.value) {
      return;
    }

    // Check cache validity
    const isCacheValid = lastFetched.value &&
      (Date.now() - lastFetched.value.getTime()) < CACHE_DURATION_MS;

    if (isCacheValid && !forceRefresh) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      users.value = await fetchUsers();
      lastFetched.value = new Date();
      cacheVersion.value += 1;
    } catch (err) {
      error.value = handleError(err);
      console.error('Failed to fetch users:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Reset store state
  const reset = () => {
    users.value = [];
    isLoading.value = false;
    error.value = null;
    lastFetched.value = null;
  };

  return {
    // State
    users,
    isLoading,
    error,
    closestUsers,
    lastFetched,
    cacheVersion,

    // Getters
    hasUsers,
    userCount,

    // Actions
    fetchUsers: fetchUsersAction,
    reset,
  };
});
