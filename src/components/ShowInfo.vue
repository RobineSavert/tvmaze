<template>
  <div
    class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
  >
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ props.show.name }}
      </h1>

      <p class="mt-1 text-sm text-zinc-400">
        {{ yearRange(props.show) }}
        • {{ channelName(props.show) }} •
        {{ props.show.runtime ?? props.show.averageRuntime ?? "—" }}m •
        {{ props.show.status ?? "—" }}
      </p>
    </div>

    <a
      v-if="props.show.officialSite"
      :href="props.show.officialSite"
      target="_blank"
      rel="noreferrer"
      class="rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/10 transition hover:bg-white/15 hover:ring-white/20"
    >
      Official site
    </a>
  </div>
</template>
<script setup lang="ts">
import type { TvMazeShow } from "../api/tvmaze.types";

const props = defineProps<{
  show: TvMazeShow;
}>();

function channelName(s: TvMazeShow) {
  return s.network?.name || s.webChannel?.name || "—";
}

function yearRange(s: TvMazeShow) {
  const start = s.premiered?.slice(0, 4) ?? "—";
  const end = s.ended?.slice(0, 4) ?? "";
  return end ? `${start}–${end}` : `${start}–`;
}
</script>
