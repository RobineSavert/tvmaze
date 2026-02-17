<template>
  <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">
    ⭐ {{ rating?.average ?? "—" }}
  </span>
</template>
<script setup lang="ts">
import type { TvMazeRating } from "../api/tvmaze.types.ts";

defineProps<{
  rating: TvMazeRating;
}>();
</script>
