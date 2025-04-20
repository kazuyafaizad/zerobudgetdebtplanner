<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Update document title based on route
watch(
  () => route.meta.title,
  (title) => {
    document.title = `${title} | ZeroBudget`;
  },
  { immediate: true }
);
</script>

<template>
  <router-view />
</template>