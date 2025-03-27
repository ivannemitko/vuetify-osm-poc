<template>
  <v-navigation-drawer
    v-model="appState.isShowingAsidePanel"
    touchless
    permanent
    :mobile="false"
    :location="$vuetify.display.mobile ? 'bottom' : 'left'"
    :width="400"
    app
  >
    <PlaceViewPanel v-if="appState.isViewingPlace" />
    <PlaceFormPanel v-if="appState.isShowingPlaceForm" />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@/stores/appState';

const appState = useAppStateStore();
</script>

<style scoped>
.v-navigation-drawer--bottom {
  max-height: 50vh;
}
</style>
