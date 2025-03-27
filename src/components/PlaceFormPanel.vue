<template>
  <div class="fill-height d-flex flex-column">
    <v-toolbar
      density="compact"
    >
      <v-toolbar-title
        :text="toolbarTitle"
        class="font-weight-bold"
      />
      <v-btn
        icon="mdi-close"
        @click="closePanel"
      />
    </v-toolbar>
    <div class="flex-fill overflow-auto pa-4">
      <PlaceForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@/stores/appState';

const appState = useAppStateStore();

const closePanel = () => {
  appState.resetMode();
};

const toolbarTitle = computed(() => {
  return appState.isCreatingPlace ? 'New Place' : 'Edit Place';
});
</script>
