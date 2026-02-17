<template>
  <main class="py-8">
    <div class="mb-5 flex items-end justify-between">
      <div>
        <h2 class="text-base font-semibold tracking-tight">Browse by genre</h2>
        <p class="text-sm text-zinc-400">
          Shows are grouped by genre &amp; sorted by rating.
          <span v-if="searchQuery"> Filtering by: “{{ searchQuery }}”</span>
        </p>
      </div>

      <span
        class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
      >
        {{ totalShows }} shows
      </span>
    </div>

    <Error v-if="error" :error="error" />

    <Loader v-if="isLoading" />

    <NoShows v-else-if="totalShows === 0" />

    <div v-else class="divide-y divide-white/10">
      <GenreRow
        v-for="section in sections"
        :key="section.genre"
        :genre="section.genre"
        :shows="section.shows"
      />
    </div>
  </main>
</template>
<script setup lang="ts">
import { computed } from "vue";
import GenreRow from "./GenreRow.vue";
import type { GenreSection } from "../stores/store-shows";
import Loader from "./Loader.vue";
import NoShows from "./NoShows.vue";
import Error from "./Error.vue";

const { sections, isLoading, error, searchQuery } = defineProps<{
  sections: GenreSection[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}>();

const totalShows = computed(() =>
  // reduce loops over all sections and accumulates a number
  // if section.shows exists, I use its length
  // if it is undefined, I use 0
  // my store already guarantees shows is always an array, so this is extra safety
  // so totalShows = total number of shows currently visible across all genres.
  // so if search filters the dataset, this number updates automatically
  sections.reduce((sum, section) => sum + (section.shows?.length ?? 0), 0),
);
</script>
