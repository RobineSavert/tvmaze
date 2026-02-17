<template>
  <header
    class="sticky top-0 z-40 -mx-4 border-b border-white/10 bg-zinc-950/80 px-4 py-4 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8"
  >
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10"
        >
          <span class="text-lg">📺</span>
        </div>
        <div>
          <h1 class="text-lg font-semibold tracking-tight">
            TV Shows Dashboard
          </h1>
          <p class="text-sm text-zinc-400">
            Search by name • filter by genre • sorted by rating
          </p>
        </div>
      </div>

      <div
        class="flex w-full flex-col gap-3 md:flex-row md:items-center lg:w-auto"
      >
        <div class="relative w-full md:w-[26rem]">
          <div
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400"
          >
            🔎
          </div>
          <input
            aria-label="Search shows"
            v-model="searchQuery"
            type="search"
            placeholder="Search shows by name…"
            class="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-white/20 focus:bg-white/10"
          />
        </div>

        <div class="relative w-full lg:w-56">
          <select
            aria-label="Genres"
            v-model="genre"
            class="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-zinc-100 outline-none transition focus:border-white/20 focus:bg-white/10"
          >
            <option class="bg-zinc-900" value="">All genres</option>
            <option v-for="g in genres" :key="g" class="bg-zinc-900" :value="g">
              {{ g }}
            </option>
          </select>

          <div
            class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// instead of defining emits, I like to use defineModel
const searchQuery = defineModel<string>("searchQuery");
const genre = defineModel<string>("genre");

defineProps<{ genres: string[] }>();
</script>
