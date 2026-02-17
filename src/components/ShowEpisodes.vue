<template>
  <div class="mt-7">
    <div class="flex items-baseline justify-between gap-4">
      <h2 class="text-base font-semibold">Episodes</h2>

      <span class="text-xs text-zinc-400" v-if="episodes.length">
        {{ episodes.length }} total
      </span>
    </div>

    <div
      v-if="episodes.length === 0"
      class="mt-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300"
    >
      No episodes found.
    </div>

    <div v-else class="mt-3 overflow-hidden rounded-2xl border border-white/10">
      <!-- Header row -->
      <div
        class="grid grid-cols-12 bg-white/5 px-4 py-3 text-xs font-medium text-zinc-300"
      >
        <div class="col-span-3 sm:col-span-2">S/E</div>
        <div class="col-span-6 sm:col-span-7">Title</div>
        <div class="col-span-3 text-right">Airdate</div>
      </div>

      <!-- Rows -->
      <div class="divide-y divide-white/10">
        <div
          v-for="episode in pagedEpisodes"
          :key="episode.id"
          class="grid grid-cols-12 px-4 py-3 text-sm"
        >
          <div class="col-span-3 sm:col-span-2 text-zinc-300">
            {{ episode.season ?? "—" }} / {{ episode.number ?? "—" }}
          </div>

          <div class="col-span-6 sm:col-span-7 text-zinc-100">
            {{ episode.name }}
          </div>

          <div class="col-span-3 text-right text-zinc-400">
            {{ formatDutchDate(episode.airdate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="episodes.length > perPage" class="mt-4">
      <Pagination
        :items="episodes"
        :totalItemCount="episodes.length"
        :perPage="perPage"
        @page-changed="onPageChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Pagination from "./Pagination.vue";
import { formatDutchDate } from "../utils/date";

export type TvMazeEpisode = {
  id: number;
  season: number | null;
  number: number | null;
  name: string;
  airdate: string | null;
};

const props = withDefaults(
  defineProps<{
    episodes: TvMazeEpisode[];
    perPage?: number;
  }>(),
  {
    perPage: 12,
  },
);

const range = ref<[number, number]>([0, props.perPage]);

// Take the full list of episodes and return only the current page’s slice
const pagedEpisodes = computed(() =>
  props.episodes.slice(range.value[0], range.value[1]),
);

// when pagination tells me which slice to show, I update my visible range
function onPageChanged([start, end]: [number, number]) {
  range.value = [start, end];
}

// reset paging when the episode list changes (e.g. navigating to another show)
watch(
  () => props.episodes.length,
  () => {
    range.value = [0, props.perPage];
  },
);
</script>
