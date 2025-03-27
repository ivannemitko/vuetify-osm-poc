<template>
  <v-fab
    v-show="showButton"
    :absolute="false"
    :app="true"
    color="primary"
    location="right bottom"
    icon="mdi-map-marker-plus"
    @click="startCreatePlace"
  />
</template>

<script setup lang="ts">
import { useMapControls } from '@/composables/useMapControls';
import { usePlaceActions } from '@/composables/usePlaceActions';

const { controls } = useMapControls();
const { startCreatePlace } = usePlaceActions();

const showButton = computed(() => controls.value.createPlace);
</script>

<style scoped>
.v-fab > :first-child {
  margin-bottom: 40px;
  margin-right: 40px;
}
</style>
