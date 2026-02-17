<template>
  <section class="py-6">
    <div class="mb-3 flex items-baseline justify-between">
      <h2 class="text-base font-semibold tracking-tight">{{ genre }}</h2>
      <span class="text-xs text-zinc-400">{{ shows.length }} shows</span>
    </div>

    <div class="-mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      <div
        class="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:thin] snap-x snap-mandatory"
      >
        <div v-for="show in shows" :key="show.id" class="w-[16rem] shrink-0">
          <ResultCard :show="show" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ResultCard from "./ResultCard.vue";
import type { TvMazeShow } from "../api/tvmaze.types";

defineProps<{
  genre: string;
  shows: TvMazeShow[];
}>();
</script>
