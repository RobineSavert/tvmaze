<template>
  <div class="mt-7">
    <h2 class="text-base font-semibold">Cast</h2>
    <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in cast.slice(0, 9)"
        :key="item.person?.id"
        class="rounded-2xl border border-white/10 bg-white/5 p-3"
      >
        <p class="text-sm font-medium">
          {{ item.person?.name ?? "—" }}
        </p>
        <p class="text-xs text-zinc-400">
          as {{ item.character?.name ?? "—" }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TvMazeCastMember } from "../api/tvmaze.types";

defineProps<{
  cast: TvMazeCastMember[];
}>();
</script>
