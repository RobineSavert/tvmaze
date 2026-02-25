<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100">
    <Glow />

    <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-4">
      <DashboardHeader
        v-model:searchQuery="searchQuery"
        v-model:genre="selectedGenre"
        :genres="allGenres"
      />

      <GenreSections
        :sections="sections"
        :isLoading="isLoading"
        :error="error"
        :searchQuery="searchQuery"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDebounce } from "../composables/useDebounce";
import { useTvShowsStore } from "../stores/store-shows";
import Glow from "../components/Glow.vue";
import DashboardHeader from "../components/DashboardHeader.vue";
import GenreSections from "../components/GenreSections.vue";

const store = useTvShowsStore();
const { searchQuery, selectedGenre, allGenres, sections, isLoading, error } =
  storeToRefs(store);

const debouncedQuery = useDebounce(searchQuery, 400);

onMounted(() => {
  store.loadShows([0, 1]);
});

watch(debouncedQuery, (q) => store.runSearch(q), { immediate: true });
</script>
