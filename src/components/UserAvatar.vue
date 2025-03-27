<template>
  <v-avatar
    :color="nameToColor(userName)"
    size="default"
    :text="nameToInitials(userName)"
  />
</template>

<script setup lang="ts">
import type { User } from '@/core';
import { nameToColor } from '@/utils/nameToColor';
import { nameToInitials } from '@/utils/nameToInitials';

const props = defineProps<{
  user: User;
}>();

const userName = computed(() => {
  return props.user.name;
});
</script>

<style scoped>

</style>
