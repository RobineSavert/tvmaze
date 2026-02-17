<template>
  <router-link
    :to="`/show/${show.id}`"
    class="block rounded-3xl border border-white/10 bg-white/5 p-3 shadow-sm transition hover:bg-white/10 hover:ring-1 hover:ring-white/10"
  >
    <div class="relative overflow-hidden rounded-2xl">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="show.name"
        class="h-48 w-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-48 w-full items-center justify-center bg-white/5 text-sm text-zinc-400"
      >
        No image
      </div>

      <!-- badges -->
      <div class="absolute bottom-2 left-2 flex flex-wrap gap-2">
        <span
          v-if="show.genres?.[0]"
          class="rounded-full bg-zinc-950/70 px-2 py-1 text-xs text-zinc-200 ring-1 ring-white/10 backdrop-blur"
        >
          {{ show.genres[0] }}
        </span>

        <span
          class="rounded-full bg-zinc-950/70 px-2 py-1 text-xs text-zinc-200 ring-1 ring-white/10 backdrop-blur"
        >
          {{ year }}
        </span>
      </div>

      <div
        class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-zinc-950/70 px-2.5 py-1 text-xs font-medium ring-1 ring-white/10 backdrop-blur"
      >
        <span>⭐</span><span>{{ show.rating?.average ?? "—" }}</span>
      </div>
    </div>

    <div class="mt-3">
      <h3 class="line-clamp-1 text-sm font-semibold">{{ show.name }}</h3>


      <ShowSummary :summary="show.summary" variant="card" :clampLines="2" />



      <div class="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1">
          {{ channel }}
        </span>
        <span>{{ runtime }}m</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TvMazeShow } from "../api/tvmaze.types";
import ShowSummary from "./ShowSummary.vue";

const props = defineProps<{
  show: TvMazeShow;
}>();

const posterUrl = computed(
  () => props.show.image?.medium || props.show.image?.original || "",
);

const year = computed(() =>
  props.show.premiered ? props.show.premiered.slice(0, 4) : "—",
);

const channel = computed(
  () => props.show.network?.name || props.show.webChannel?.name || "—",
);

const runtime = computed(
  () => props.show.runtime ?? props.show.averageRuntime ?? "—",
);
</script>
