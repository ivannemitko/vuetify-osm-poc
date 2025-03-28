<template>
  <v-toolbar
    v-show="placesFilterStore.isOpen"
    rounded="lg"
    border
    floating
    tag="div"
    elevation="1"
    class="ma-3 float-end"
  >
    <div class="px-4 pt-4 w-100">
      <v-select
        v-model="placesFilterStore.types"
        clearable
        chips
        multiple
        :label="label"
        :items="placeTypes"
        item-title="label"
        item-value="value"
        variant="underlined"
      />
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
import { usePlacesFilterStore } from '@/stores/placesFilter';

const placesFilterStore = usePlacesFilterStore();

const KNOWN_PLACE_TYPES = [
  { label: 'Store', value: 'store' },
  { label: 'Cafe', value: 'cafe' },
  { label: 'Office', value: 'office' },
] as const;

const placeTypes = computed(() => KNOWN_PLACE_TYPES);

const label = computed(() => placesFilterStore.hasFilters ? 'Only selected types' : 'All types of places');
</script>

<style scoped lang="scss">
  @media only screen and (orientation: landscape) {
    .v-toolbar {
      --max-screen-width: 100vh;
    }
  }

  @media only screen and (orientation: portrait) {
    .v-toolbar {
      --max-screen-width: 100vw;
    }
  }

  .v-toolbar {
    --margin: 24px;
    --min-screen-width: 320px;
    z-index: 1000;
    max-width: calc(var(--max-screen-width) - var(--margin));
    min-width: calc(var(--min-screen-width) - var(--margin));
  }
</style>
