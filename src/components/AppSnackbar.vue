<template>
  <v-snackbar
    v-model="isOpen"
    :timeout="timeout"
    :color="color"
    location="bottom"
    multi-line
  >
    {{ message }}

    <template #actions>
      <v-btn
        variant="text"
        @click="isOpen = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useSnackbarStore } from '@/stores/snackbar';

const snackbar = useSnackbarStore();
const { isOpen, message, color, timeout } = storeToRefs(snackbar);
</script>
