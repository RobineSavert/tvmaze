<template>
  <span
    v-for="genre in genres"
    :key="genre"
    class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10"
  >
    {{ genre }}
  </span>
</template>
<script setup lang="ts">
defineProps<{
  genres: string[];
}>();
</script>
