<template>
  <div :class="wrapperClass">
    <div
        v-if="summary"
        :class="contentClass"
        v-html="summary"
    />
    <div v-else class="text-zinc-400">
      {{ emptyText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
      summary?: string | null;
      clampLines?: number;
      variant?: "card" | "detail";
      emptyText?: string;
    }>(),
    {
      clampLines: 0,
      variant: "detail",
      emptyText: "No summary available...",
    },
);

const wrapperClass = computed(() => {
  return props.variant === "card"
      ? "mt-1 text-xs text-zinc-400"
      : "mt-5 text-sm leading-relaxed text-zinc-300";
});

// created map because tailwind classes won't be generated with dynamic line-clamp-$number
const clampClassMap: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

const contentClass = computed(() => {
  const clamp = props.clampLines ? clampClassMap[props.clampLines] ?? "" : "";

  if (props.variant === "card") {
    return `min-w-0 ${clamp}`.trim();
  }

  // filter(Boolean) removes empty strings so we don’t end up with double spaces.
  return [
    "prose prose-invert max-w-none prose-p:my-2 prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline",
    "min-w-0",
    clamp,
  ].filter(Boolean).join(" ");
});

</script>
