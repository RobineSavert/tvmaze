<template>
  <div
    :class="[
      'overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5',
      wrapperClass,
    ]"
  >
    <img
      v-if="url"
      :src="url"
      :alt="show.name"
      :class="['w-full object-cover', imageClass]"
      :loading="loading"
      :fetchpriority="fetchPriority"
    />

    <div
      v-else
      :class="[
        'flex w-full items-center justify-center text-sm text-zinc-400',
        imageClass,
      ]"
    >
      No image
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TvMazeShow } from "../api/tvmaze.types";

const props = withDefaults(
  defineProps<{
    show: TvMazeShow;
    loading?: "lazy" | "eager";
    fetchPriority?: "high" | "low" | "auto";
    imageClass?: string;
    wrapperClass?: string; // optional override
  }>(),
  {
    loading: "lazy",
    fetchPriority: "auto",
    imageClass: "h-48",
    wrapperClass: "",
  },
);

const url = computed(() => {
  return props.show.image?.original || props.show.image?.medium || "";
});
</script>
