<template>
  <v-progress-linear
    :active="appStore.isLoading"
    :indeterminate="true"
    location="bottom"
    absolute
  />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
</script>
