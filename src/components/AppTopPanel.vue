<template>
  <v-app-bar
    title="Place Manager"
    color="primary"
  >
    <AppProgressBar />

    <template #append>
      <PlaceFilterToggle />
    </template>
  </v-app-bar>
</template>
