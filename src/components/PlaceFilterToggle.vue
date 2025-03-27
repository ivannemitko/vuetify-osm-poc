<template>
  <v-btn
    icon="mdi-filter"
    :color="filterIconColor"
    @click="placesFilterStore.toggleFilter"
  >
    <v-badge
      dot
      color="warning"
      :model-value="placesFilterStore.hasFilters"
    >
      <v-icon
        icon="mdi-filter"
      />
    </v-badge>
  </v-btn>
</template>

<script setup lang="ts">
import { usePlacesFilterStore } from '@/stores/placesFilter';

const placesFilterStore = usePlacesFilterStore();

const filterIconColor = computed(() => {
  return placesFilterStore.isOpen ? 'grey-darken-2' : 'white';
});
</script>
