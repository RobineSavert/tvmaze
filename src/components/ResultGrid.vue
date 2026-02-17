<template>
  <main class="py-8">
    <section
      class="mb-5 flex lg:flex-col gap-2 flex-row items-end justify-between"
    >
      <div>
        <h2 class="text-base font-semibold tracking-tight">Results</h2>
        <p class="text-sm text-zinc-400">
          <span v-if="selectedGenre">Genre: {{ selectedGenre }} • </span>
          Sorted by rating (highest first)
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
        >
          {{ shows.length }} shows
        </span>
      </div>
    </section>

    <Error v-if="error" :error="error" />

    <NoShows v-if="!isLoading && shows.length === 0" />

    <section v-else>
      <ResultCard v-for="show in shows" :key="show.id" :show="show" />
    </section>
  </main>
</template>

<script setup lang="ts">
import type { TvMazeShow } from "../api/tvmaze.types";
import ResultCard from "./ResultCard.vue";
import Error from "./Error.vue";
import NoShows from "./NoShows.vue";

defineProps<{
  shows: TvMazeShow[];
  isLoading: boolean;
  error: string | null;
  selectedGenre?: string;
}>();
</script>
