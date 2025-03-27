<template>
  <v-layout class="h-100">
    <AppTopPanel />
    <AppAsidePanel />
    <v-main class="">
      <MapContainer />
      <PlaceFilter />
      <PlaceCreationFab />
      <router-view />
    </v-main>
    <AppSnackbar />
  </v-layout>
</template>
