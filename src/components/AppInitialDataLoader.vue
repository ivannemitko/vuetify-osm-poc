<template>
  <!-- Global error notification (non-blocking) -->
  <v-snackbar
    v-model="appStore.hasError"
    :timeout="5000"
    color="error"
    location="bottom"
  >
    Failed to load application data.
    <template #actions>
      <v-btn
        variant="text"
        @click="retryInitialLoad"
      >
        Retry
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app';
import { usePlaceStore } from '@/stores/places';
import { useUserStore } from '@/stores/users';

const appStore = useAppStore();
const userStore = useUserStore();
const placeStore = usePlaceStore();

/**
 * Initial data loading strategy:
 * - Fetches data in background
 * - Shows non-blocking indicators
 * - Automatically retries failed requests
 */
const loadInitialData = async () => {
  try {
    // Parallel fetch with automatic error handling via stores
    await Promise.allSettled([
      userStore.fetchUsers(),
      placeStore.fetchStaticPlaces(),
    ]);
  } catch (error) {
    console.error('Unexpected error during initial load:', error);
  }
};

/**
 * Retry failed requests
 */
const retryInitialLoad = () => {
  appStore.resetError();
  loadInitialData();
};

// Initial load
loadInitialData();
</script>
